import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Instagram } from 'lucide-react';
import { APP_NAME } from '../../lib/constants';

export function Footer() {
  return (
    <footer className="border-t border-borderc bg-surface-2 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-lg font-extrabold text-text-primary">
              Stream<span className="text-primary">Flix</span>
            </p>
            <p className="mt-2 max-w-xs text-sm text-text-secondary">
              Entertainment that moves with you. Watch anywhere, on any device.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-text-primary">Company</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link className="hover:text-text-primary" to="/">About</Link></li>
              <li><Link className="hover:text-text-primary" to="/">Help Center</Link></li>
              <li><Link className="hover:text-text-primary" to="/">Contact</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-text-primary">Legal</p>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><Link className="hover:text-text-primary" to="/">Terms of Use</Link></li>
              <li><Link className="hover:text-text-primary" to="/">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-text-primary">Follow</p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-text-secondary hover:text-text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="text-text-secondary hover:text-text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-text-secondary hover:text-text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <p className="mt-10 text-xs text-text-secondary">
          © {new Date().getFullYear()} {APP_NAME}. A demo streaming platform. All content is placeholder / public-domain.
        </p>
        <p className="mt-2 text-xs text-text-secondary">
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </div>
    </footer>
  );
}
