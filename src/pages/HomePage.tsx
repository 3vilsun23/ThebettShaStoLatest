import { useEffect, useState } from 'react';
import { Feather, ArrowRight, Users, Clock } from 'lucide-react';
import { Header } from '../components/Header';
import { StoryDisplay } from '../components/StoryDisplay';
import { useStory } from '../lib/useStory';
import type { Route } from '../lib/router';

type Props = {
  navigate: (r: Route) => void;
  isSignedIn: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function HomePage({ navigate, isSignedIn, theme, onToggleTheme }: Props) {
  const { words, loading } = useStory();
  const [showFade, setShowFade] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowFade(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen paper-texture">
      <Header wordCount={words.length} onTitleClick={() => navigate('home')} theme={theme} onToggleTheme={onToggleTheme} />

      {/* Story reader — comes first */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pt-12 md:pt-16 pb-8">
        <div
          className={`relative rounded-2xl bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border border-ink-200/50 dark:border-ink-800/60 shadow-xl shadow-ink-800/5 dark:shadow-black/30 p-8 md:p-12 transition-all duration-1000 ${showFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-ink-800 dark:bg-ink-100 text-ink-50 dark:text-ink-900 text-xs font-sans uppercase tracking-widest">
            The Story So Far
          </div>
          <StoryDisplay words={words} loading={loading} highlightLast />
        </div>
      </section>

      {/* CTA button — between story and hero text */}
      <div
        className={`flex justify-center pb-10 transition-all duration-1000 delay-200 ${showFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <button
          onClick={() => navigate(isSignedIn ? 'contribute' : 'signin')}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-ink-800 dark:bg-accent-600 text-ink-50 dark:text-white font-sans text-base font-medium shadow-lg shadow-ink-800/20 dark:shadow-accent-900/30 hover:bg-ink-900 dark:hover:bg-accent-500 transition-all hover:scale-[1.03] active:scale-95"
        >
          <Feather className="w-5 h-5" strokeWidth={1.5} />
          <span>{isSignedIn ? 'Add Your Word' : 'Become Part of the Story'}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2} />
        </button>
      </div>

      {/* Hero text — comes after the button */}
      <section className="max-w-5xl mx-auto px-6 pt-6 md:pt-10 pb-10 text-center">
        <div
          className={`transition-all duration-1000 delay-500 ${showFade ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-400 mb-5">
            A living, breathing story — written by everyone
          </p>
          <h2 className="font-serif text-4xl md:text-6xl font-light text-ink-800 dark:text-ink-100 leading-tight max-w-3xl mx-auto">
            One word at a time, <em className="text-accent-600 dark:text-accent-400 not-italic font-medium">together</em>.
          </h2>
          <p className="mt-6 font-sans text-base md:text-lg text-ink-500 dark:text-ink-300 max-w-xl mx-auto leading-relaxed">
            Every person adds a single word every 24 hours. No one controls the plot.
            The story goes wherever the crowd takes it.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Users className="w-6 h-6" strokeWidth={1.5} />}
            title="Written by all"
            description="Every signed-in reader is a co-author. The story belongs to no one and everyone."
          />
          <FeatureCard
            icon={<Feather className="w-6 h-6" strokeWidth={1.5} />}
            title="One word per day"
            description="Each contributor adds a single word every 24 hours. Choose it with care."
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" strokeWidth={1.5} />}
            title="Read it live"
            description="Watch the story grow in real time as words arrive from around the world."
          />
        </div>
      </section>

      <footer className="border-t border-ink-200/50 dark:border-ink-800/60 py-8 text-center">
        <p className="font-serif text-sm text-ink-400 dark:text-ink-500 italic">
          The Shared Story — a collective tale, written one word at a time.
        </p>
        <div className="mt-3 flex items-center justify-center gap-2 font-sans text-sm">
          <button
            onClick={() => navigate('privacy')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Privacy Policy
          </button>
          <span className="text-ink-300 dark:text-ink-600">·</span>
          <button
            onClick={() => navigate('terms')}
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Terms of Service
          </button>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center md:text-left">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-50 dark:bg-accent-900/40 text-accent-600 dark:text-accent-400 mb-4">
        {icon}
      </div>
      <h3 className="font-serif text-lg font-medium text-ink-800 dark:text-ink-100 mb-2">{title}</h3>
      <p className="font-sans text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{description}</p>
    </div>
  );
}
