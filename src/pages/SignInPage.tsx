import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Moon, Sun, ArrowRight } from 'lucide-react';
import { useStory } from '../lib/useStory';
import { StoryDisplay } from '../components/StoryDisplay';
import { useAuth } from '../lib/auth';
import type { Route } from '../lib/router';

type Props = {
  navigate: (r: Route) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function SignInPage({ navigate, theme, onToggleTheme }: Props) {
  const { words, loading } = useStory();
  const { signInWithGoogle } = useAuth();

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleGoogleSignIn = async () => {
    setError(null);
    setBusy(true);
    const err = await signInWithGoogle();
    setBusy(false);
    if (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen paper-texture">
      <header className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-2.5 group"
        >
          <BookOpen className="w-5 h-5 text-ink-500 dark:text-ink-300 group-hover:text-accent-500 transition-colors" strokeWidth={1.5} />
          <h1 className="font-serif text-xl md:text-2xl font-medium text-ink-800 dark:text-ink-100 tracking-tight">
            The Shared Story
          </h1>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-full text-ink-500 dark:text-ink-300 hover:text-ink-800 dark:hover:text-ink-50 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" strokeWidth={1.5} />
            ) : (
              <Moon className="w-4 h-4" strokeWidth={1.5} />
            )}
          </button>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-ink-100/80 dark:bg-ink-900/80 border border-ink-200/60 dark:border-ink-800/60">
            <span className="font-sans text-xs uppercase tracking-widest text-ink-400 dark:text-ink-400">Words</span>
            <span className="font-serif text-lg font-semibold text-ink-700 dark:text-ink-100 tabular-nums">
              {words.length.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-8 md:pt-12 pb-20">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center gap-2 text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors mb-8 font-sans text-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to the story
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div
            className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <p className="font-sans text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-400 mb-4">
              Join the story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-ink-800 dark:text-ink-100 leading-tight mb-4">
              Sign in to continue.
            </h2>
            <p className="font-sans text-base text-ink-500 dark:text-ink-300 leading-relaxed mb-8 max-w-md">
              Sign in with Google to add your next word to the story. You'll be redirected to Google, then back here.
            </p>

            <div className="bg-white/70 dark:bg-ink-900/70 backdrop-blur-sm border border-ink-200/50 dark:border-ink-800/60 rounded-2xl p-8 shadow-lg shadow-ink-800/5 dark:shadow-black/20 max-w-md">
              <button
                onClick={handleGoogleSignIn}
                disabled={busy}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white dark:bg-ink-50 border border-ink-200 dark:border-ink-200 text-ink-700 dark:text-ink-900 font-sans text-base font-medium hover:bg-ink-50 dark:hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {busy ? (
                  <>
                    <div className="h-4 w-4 border-2 border-ink-300 border-t-ink-700 dark:border-t-ink-900 rounded-full animate-spin" />
                    <span>Redirecting…</span>
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                  <span className="font-sans text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}

              <p className="mt-6 text-center font-sans text-sm text-ink-400 dark:text-ink-500">
                By continuing, you agree to add at most one word every 24 hours.
              </p>
            </div>
          </div>

          <div
            className={`transition-all duration-700 delay-150 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <div className="relative rounded-2xl bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border border-ink-200/50 dark:border-ink-800/60 shadow-xl shadow-ink-800/5 dark:shadow-black/30 p-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-ink-800 dark:bg-ink-100 text-ink-50 dark:text-ink-900 text-xs font-sans uppercase tracking-widest">
                Reading Live
              </div>
              <StoryDisplay words={words} loading={loading} />
            </div>
            <p className="mt-4 text-center font-serif text-sm text-ink-400 dark:text-ink-500 italic">
              The story updates in real time as new words are added.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
