import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface TrailerPlayerProps {
  youtubeKey: string;
  title: string;
}

export function TrailerPlayer({ youtubeKey, title }: TrailerPlayerProps) {
  const navigate = useNavigate();
  const src =
    'https://www.youtube.com/embed/' + youtubeKey + '?autoplay=1&rel=0&modestbranding=1';

  return (
    <div className="relative flex h-screen w-full flex-col bg-black">
      <iframe
        className="h-full w-full"
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="absolute left-4 top-4 z-20 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
      >
        <ArrowLeft className="h-6 w-6" />
      </button>
    </div>
  );
}
