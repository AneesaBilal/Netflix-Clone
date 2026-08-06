import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';

export function Logo() {
  return (
    <Link to="/home" className="flex items-center gap-2" aria-label="StreamFlix home">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <Clapperboard className="h-5 w-5 text-white" />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-text-primary">
        Stream<span className="text-primary">Flix</span>
      </span>
    </Link>
  );
}
