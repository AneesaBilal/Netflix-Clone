// Streams public-domain movies & animation from the Internet Archive.
// No API key required. Only legally free content is served.

export interface ArchiveTitle {
  identifier: string;
  title: string;
  year: number | null;
  description: string;
  poster_url: string;
  video_url: string;
  runtime_minutes: number | null;
  kind: 'movie' | 'animation';
}

interface ArchiveFile {
  name: string;
  size?: string | number;
}

const SEARCH_URL = 'https://archive.org/advancedsearch.php';
const META_URL = 'https://archive.org/metadata/';
const DOWNLOAD_URL = 'https://archive.org/download/';

const FALLBACK_MOVIES = [
  'night_of_the_living_dead',
  'House_on_Haunted_Hill',
  'His_Girl_Friday',
  'Plan_9_from_Outer_Space',
  'Carnival_of_Souls',
  'Reefer_Madness',
  'Detour_1945',
  'Charade_1963',
  'Nosferatu_1922',
  'Suddenly_1954',
];

const FALLBACK_ANIMATION = [
  'Betty_Boop_Snow_White',
  'Popeye_the_Sailor_Meets_Sinbad_the_Sailor',
  'Felix_the_Cat_1919',
  'Koko_the_Clown',
  'Snow_White_1933',
  'Christmas_Comes_But_Once_a_Year',
  'The_Golden_Bat',
  'Popeye-Boiled-Down',
];

async function fetchJson(url: string, timeoutMs: number): Promise<any | null> {
  try {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { signal: controller.signal });
    window.clearTimeout(timer);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function stripHtml(value: unknown): string {
  if (value == null) return '';
  return String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 400);
}

function parseRuntime(value: unknown): number | null {
  if (value == null) return null;
  const s = String(value).trim();
  if (/^\d+(\.\d+)?$/.test(s)) return Math.max(1, Math.round(Number(s) / 60));
  const hms = s.match(/(\d+):(\d{2}):(\d{2})/);
  if (hms) return Number(hms[1]) * 60 + Number(hms[2]);
  const ms = s.match(/(\d+):(\d{2})/);
  if (ms) return Number(ms[1]);
  return null;
}

export async function getArchiveDetails(
  identifier: string,
  kind: 'movie' | 'animation' = 'movie'
): Promise<ArchiveTitle | null> {
  const json = await fetchJson(META_URL + encodeURIComponent(identifier), 9000);
  if (!json) return null;
  const md = json.metadata;
  const files: ArchiveFile[] = Array.isArray(json.files) ? json.files : [];
  if (!md) return null;

  const mp4s = files
    .filter((f) => f.name && f.name.toLowerCase().endsWith('.mp4'))
    .sort((a, b) => Number(b.size || 0) - Number(a.size || 0));
  const video = mp4s[0];
  if (!video) return null;

  const thumb =
    files.find((f) => f.name === '__ia_thumb.jpg') ||
    files.find((f) => /\.(jpe?g|png)$/i.test(f.name)) ||
    files.find((f) => /\.gif$/i.test(f.name));
  const poster = thumb
    ? DOWNLOAD_URL + encodeURIComponent(identifier) + '/' + encodeURIComponent(thumb.name)
    : 'https://archive.org/services/get-item-image.php?collection=feature_films&identifier=' +
      encodeURIComponent(identifier);

  const yearNum = md.year != null ? Number(String(md.year).slice(0, 4)) : null;

  return {
    identifier,
    title: md.title || identifier,
    year: yearNum && !isNaN(yearNum) ? yearNum : null,
    description: stripHtml(md.description),
    poster_url: poster,
    video_url:
      DOWNLOAD_URL + encodeURIComponent(identifier) + '/' + encodeURIComponent(video.name),
    runtime_minutes: parseRuntime(md.runtime),
    kind,
  };
}

async function mapLimited<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    const settled = await Promise.all(chunk.map(fn));
    results.push(...settled);
  }
  return results;
}

export async function fetchArchiveTitles(
  kind: 'movie' | 'animation'
): Promise<ArchiveTitle[]> {
  const collection = kind === 'animation' ? 'animationandcartoons' : 'feature_films';

  const params = new URLSearchParams();
  params.set('q', 'collection:(' + collection + ') AND mediatype:(movies)');
  params.append('fl[]', 'identifier');
  params.append('fl[]', 'title');
  params.append('fl[]', 'year');
  params.set('rows', '12');
  params.set('page', '1');
  params.append('sort[]', 'downloads desc');
  params.set('output', 'json');

  const json = await fetchJson(SEARCH_URL + '?' + params.toString(), 9000);
  let docs: Array<{ identifier: string }> =
    (json && json.response && json.response.docs) || [];

  if (docs.length === 0) {
    docs = (kind === 'animation' ? FALLBACK_ANIMATION : FALLBACK_MOVIES).map(
      (identifier) => ({ identifier })
    );
  }

  const details = await mapLimited(docs.slice(0, 12), 4, (d) =>
    getArchiveDetails(d.identifier, kind)
  );
  return details.filter((d): d is ArchiveTitle => d !== null).slice(0, 10);
}
