import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Plus, Check, Star } from 'lucide-react';
import type { Movie, TvShow } from '../../types';
import { HERO_ROTATE_MS } from '../../lib/constants';
import { formatMinutes } from '../../lib/utils';
import { Button } from '../ui/Button';

interface HeroItem {
  type: 'movie' | 'show';
  data: Movie | TvShow;
}

interface HeroBannerProps {
  items: HeroItem[];
  inList: (item: HeroItem) => boolean;
  onToggleList: (item: HeroItem) => void;
}

export function HeroBanner({ items, inList, onToggleList }: HeroBannerProps) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, HERO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const safeIndex = Math.min(index, items.length - 1);
  const current = items[safeIndex];
  const item = current.data;
  const backdrop = item.backdrop_url || item.poster_url || 'https://picsum.photos/seed/hero/1280/720';
  const playPath = current.type === 'movie' ? '/watch/movie/' + item.id : '/tv/' + item.slug;
  const detailPath = current.type === 'movie' ? '/movie/' + item.slug : '/tv/' + item.slug;
  const runtime = current.type === 'movie' ? (item as Movie).runtime_minutes : null;

  return (
    <section className="relative h-[62vh] min-h-[420px] w-full overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img src={backdrop} alt="" className="h-full w-full object-cover" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end gap-4 px-4 pb-14 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
          >
            <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-text-secondary">
              {item.rating != null && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4 fill-yellow-400" /> {Number(item.rating).toFixed(1)}
                </span>
              )}
              {item.release_year && <span>{item.release_year}</span>}
              {runtime != null && <span>{formatMinutes(runtime)}</span>}
              {item.age_rating && (
                <span className="rounded border border-borderc px-1.5 py-0.5 text-xs">{item.age_rating}</span>
              )}
              {(item.genres || []).slice(0, 3).map((g) => (
                <span key={g.id} className="text-xs">{g.name}</span>
              ))}
            </div>
            <h1 className="text-shadow-hero text-3xl font-extrabold text-white sm:text-5xl">{item.title}</h1>
            <p className="mt-3 line-clamp-3 max-w-xl text-sm text-white/85 sm:text-base">
              {item.description}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={() => navigate(playPath)}>
            <Play className="h-5 w-5 fill-white text-white" /> Play
          </Button>
          <Button size="lg" variant="secondary" onClick={() => navigate(detailPath)}>
            <Info className="h-5 w-5" /> More Info
          </Button>
          <button
            type="button"
            onClick={() => onToggleList(current)}
            aria-label={inList(current) ? 'Remove from My List' : 'Add to My List'}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white/15"
          >
            {inList(current) ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </section>
  );
}
