import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, SkipBack, SkipForward, Gauge,
} from 'lucide-react';
import { formatSeconds } from '../../lib/utils';
import { PLAYER_SKIP_SECONDS } from '../../lib/constants';

interface VideoPlayerProps {
  src: string;
  title: string;
  startAt?: number;
  onProgress: (currentSeconds: number, durationSeconds: number, completed: boolean) => void;
}

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoPlayer({ src, title, startAt = 0, onProgress }: VideoPlayerProps) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<number | null>(null);
  const lastSaved = useRef<number>(0);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [rate, setRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(true);
  const [error, setError] = useState(false);
  const [rateMenuOpen, setRateMenuOpen] = useState(false);

  const bumpControls = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShowControls(false), 3000);
  }, []);

  useEffect(() => () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
  }, []);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => setError(true));
    } else {
      video.pause();
    }
  }, []);

  const seekBy = useCallback((delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(0, video.currentTime + delta), video.duration || 0);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    if (Math.abs(video.currentTime - lastSaved.current) >= 5) {
      lastSaved.current = video.currentTime;
      const completed = video.duration > 0 && video.currentTime >= video.duration * 0.95;
      onProgress(video.currentTime, video.duration || 0, completed);
    }
  }, [onProgress]);

  const handleEnded = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    onProgress(video.duration || 0, video.duration || 0, true);
  }, [onProgress]);

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen().catch(() => undefined);
    }
  }, []);

  const changeVolume = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = value;
    video.muted = value === 0;
    setVolume(value);
    setMuted(value === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const changeRate = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = value;
    setRate(value);
    setRateMenuOpen(false);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
      if (e.key === 'ArrowRight') seekBy(PLAYER_SKIP_SECONDS);
      if (e.key === 'ArrowLeft') seekBy(-PLAYER_SKIP_SECONDS);
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'm') toggleMute();
      bumpControls();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [togglePlay, seekBy, toggleFullscreen]);

  return (
    <div
      ref={containerRef}
      onMouseMove={bumpControls}
      onTouchStart={bumpControls}
      className="relative flex h-screen w-full flex-col bg-black"
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        className="h-full w-full object-contain"
        onClick={togglePlay}
        onPlay={() => { setPlaying(true); setBuffering(false); }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => setBuffering(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          const video = videoRef.current;
          if (!video) return;
          setDuration(video.duration || 0);
          if (startAt > 0 && startAt < (video.duration || Infinity)) {
            video.currentTime = startAt;
          }
        }}
        onEnded={handleEnded}
        onError={() => setError(true)}
        playsInline
      />

      {buffering && !error && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/25 border-t-primary" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/90 px-6 text-center">
          <p className="text-lg font-semibold text-white">Playback failed</p>
          <p className="max-w-md text-sm text-white/70">
            The video could not be loaded. Check your connection or try again later.
          </p>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-white/80"
          >
            Go back
          </button>
        </div>
      )}

      {/* Top bar */}
      <div
        className={
          'absolute inset-x-0 top-0 flex items-center gap-3 bg-gradient-to-b from-black/80 to-transparent px-4 py-4 transition-opacity ' +
          (showControls ? 'opacity-100' : 'opacity-0')
        }
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="rounded-full p-2 text-white hover:bg-white/15"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <p className="truncate text-sm font-semibold text-white sm:text-base">{title}</p>
      </div>

      {/* Bottom controls */}
      <div
        className={
          'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-4 pb-5 pt-10 transition-opacity ' +
          (showControls ? 'opacity-100' : 'opacity-0')
        }
      >
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={(e) => {
            const video = videoRef.current;
            if (!video) return;
            const value = Number(e.target.value);
            video.currentTime = value;
            setCurrentTime(value);
          }}
          aria-label="Seek"
          className="w-full cursor-pointer"
        />
        <div className="mt-2 flex items-center gap-2 sm:gap-4">
          <button type="button" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'} className="rounded-full p-2 text-white hover:bg-white/15">
            {playing ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 fill-white" />}
          </button>
          <button type="button" onClick={() => seekBy(-PLAYER_SKIP_SECONDS)} aria-label="Skip back" className="rounded-full p-2 text-white hover:bg-white/15">
            <SkipBack className="h-5 w-5" />
          </button>
          <button type="button" onClick={() => seekBy(PLAYER_SKIP_SECONDS)} aria-label="Skip forward" className="rounded-full p-2 text-white hover:bg-white/15">
            <SkipForward className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <button type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} className="rounded-full p-2 text-white hover:bg-white/15">
              {muted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-24 cursor-pointer"
            />
          </div>

          <span className="ml-1 text-xs text-white/80 sm:text-sm">
            {formatSeconds(currentTime)} / {formatSeconds(duration)}
          </span>

          <div className="ml-auto flex items-center gap-1">
            <div className="relative">
              <button type="button" onClick={() => setRateMenuOpen((v) => !v)} aria-label="Playback speed" className="flex items-center gap-1 rounded-full p-2 text-white hover:bg-white/15">
                <Gauge className="h-5 w-5" />
                <span className="text-xs">{rate}x</span>
              </button>
              {rateMenuOpen && (
                <div className="absolute bottom-12 right-0 w-24 overflow-hidden rounded-lg border border-white/15 bg-black/90">
                  {RATES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => changeRate(r)}
                      className={
                        'block w-full px-3 py-1.5 text-left text-xs text-white hover:bg-white/15 ' +
                        (r === rate ? 'font-bold text-primary' : '')
                      }
                    >
                      {r}x
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="button" onClick={toggleFullscreen} aria-label="Fullscreen" className="rounded-full p-2 text-white hover:bg-white/15">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
