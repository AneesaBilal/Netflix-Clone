import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-4 text-center">
      <Clapperboard className="h-14 w-14 text-primary" />
      <h1 className="text-4xl font-extrabold text-text-primary sm:text-6xl">404</h1>
      <p className="max-w-md text-lg text-text-secondary">Looks like you've wandered off-screen.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link to="/home"><Button size="lg">Go Home</Button></Link>
        <Link to="/movies"><Button size="lg" variant="secondary">Browse Movies</Button></Link>
      </div>
    </div>
  );
}
