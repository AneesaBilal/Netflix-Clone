import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PlayCircle, Tv, Download, Users, Clapperboard, ChevronDown, Github, Twitter, Instagram,
} from 'lucide-react';
import { Logo } from '../components/layout/Logo';
import { ThemeToggle } from '../components/layout/ThemeToggle';
import { Button } from '../components/ui/Button';

const faqs = [
  { q: 'What is StreamFlix?', a: 'StreamFlix is a modern streaming platform demo. Browse movies and series, build your list, and watch across devices.' },
  { q: 'How much does it cost?', a: 'This is a portfolio demo project. There are no charges and no real subscriptions.' },
  { q: 'Where can I watch?', a: 'Anywhere the web runs - desktop, tablet and mobile. The interface adapts to your screen.' },
  { q: 'Can I create profiles?', a: 'Yes. Create multiple profiles per account, including kids profiles with age-appropriate content.' },
  { q: 'How do I cancel?', a: 'There is nothing to cancel. Simply sign out whenever you like.' },
];

const features = [
  { icon: Clapperboard, title: 'Thousands of titles', text: 'Movies and series across every genre, with new additions all the time.' },
  { icon: Tv, title: 'Watch on every device', text: 'A responsive experience for desktop, tablet and mobile.' },
  { icon: PlayCircle, title: 'Continue where you left off', text: 'Your progress is saved so you can resume any title instantly.' },
  { icon: Users, title: 'Personalized profiles', text: 'Give everyone their own space with individual lists and history.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4 sm:px-8">
          <div className="[&_span]:text-white"><Logo /></div>
          <div className="flex items-center gap-1 sm:gap-3">
            <nav className="hidden items-center gap-4 text-sm text-white/80 md:flex">
              <Link to="/browse" className="hover:text-white">Browse</Link>
              <Link to="/movies" className="hover:text-white">Movies</Link>
              <Link to="/tv-shows" className="hover:text-white">TV Shows</Link>
            </nav>
            <ThemeToggle />
            <Link to="/login">
              <Button variant="primary" size="sm">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative flex min-h-[86vh] items-center justify-center overflow-hidden">
        <img
          src="https://picsum.photos/seed/streamflix-landing/1920/1080"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-background" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mx-auto max-w-3xl px-4 text-center"
        >
          <h1 className="text-shadow-hero text-4xl font-extrabold text-white sm:text-6xl">
            Entertainment that moves with you.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Stream unlimited movies and series in one beautifully simple place.
            Watch anywhere, save your favorites, and pick up right where you left off.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register"><Button size="lg"><PlayCircle className="h-5 w-5" /> Start Watching</Button></Link>
            <Link to="/browse"><Button size="lg" variant="secondary">Explore Content</Button></Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-8">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Why StreamFlix?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="rounded-2xl border border-borderc bg-surface p-6">
                <Icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-text-secondary">{f.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Devices band */}
      <section className="border-y border-borderc bg-surface-2">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-16 sm:px-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Watch across all your devices</h2>
            <p className="mt-3 text-text-secondary">
              Phone, tablet, laptop and big screen. StreamFlix adapts to wherever you are,
              with continue-watching that follows you between sessions.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-text-secondary">
              <li>· Unlimited movies & series</li>
              <li>· Personalized profiles, including kids</li>
              <li>· Resume instantly on any screen</li>
            </ul>
          </div>
          <img
            src="https://picsum.photos/seed/streamflix-devices/800/500"
            alt="StreamFlix across devices"
            className="w-full rounded-2xl border border-borderc object-cover"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Frequently Asked Questions</h2>
        <div className="mt-8 space-y-3">
          {faqs.map((faq, i) => (
            <div key={faq.q} className="overflow-hidden rounded-xl bg-surface">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
              >
                {faq.q}
                <ChevronDown className={'h-5 w-5 transition-transform ' + (openFaq === i ? 'rotate-180' : '')} />
              </button>
              {openFaq === i && (
                <div className="border-t border-borderc px-5 py-4 text-sm text-text-secondary">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary/10">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to watch?</h2>
          <p className="mt-2 text-text-secondary">Create your account and start streaming in seconds.</p>
          <div className="mt-6">
            <Link to="/register"><Button size="lg">Get Started</Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-borderc px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="[&_span]:text-text-primary"><Logo /></div>
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-text-secondary">
            <Link to="/" className="hover:text-text-primary">About</Link>
            <Link to="/" className="hover:text-text-primary">Help Center</Link>
            <Link to="/" className="hover:text-text-primary">Terms</Link>
            <Link to="/" className="hover:text-text-primary">Privacy</Link>
            <Link to="/" className="hover:text-text-primary">Contact</Link>
          </nav>
          <div className="flex gap-3 text-text-secondary">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github className="h-5 w-5" /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter className="h-5 w-5" /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-text-secondary">
          StreamFlix is an original demo project. Not affiliated with Netflix.
        </p>
      </footer>
    </div>
  );
}
