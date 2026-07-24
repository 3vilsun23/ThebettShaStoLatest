import { useEffect, useState, useCallback } from 'react';
import { Feather, LogOut, Clock, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { StoryDisplay } from '../components/StoryDisplay';
import { useStory } from '../lib/useStory';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import type { Route } from '../lib/router';

type Props = {
  navigate: (r: Route) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

type CooldownStatus = {
  canContribute: boolean;
  msRemaining: number;
  lastWordAt: string | null;
};

export function ContributePage({ navigate, theme, onToggleTheme }: Props) {
  const { user, signOut, loading: authLoading } = useAuth();
  const { words, loading: storyLoading, refetch } = useStory();
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [cooldown, setCooldown] = useState<CooldownStatus | null>(null);

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('signin');
    }
  }, [authLoading, user, navigate]);

  // Tick every second to re-render the countdown timer
  const [, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const checkCooldown = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('story_words')
      .select('created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Cooldown check failed:', error.message);
      return;
    }

    if (!data) {
      setCooldown({ canContribute: true, msRemaining: 0, lastWordAt: null });
      return;
    }

    const lastAt = new Date(data.created_at).getTime();
    const elapsed = Date.now() - lastAt;
    const cooldownMs = 24 * 60 * 60 * 1000;
    const remaining = cooldownMs - elapsed;

    setCooldown({
      canContribute: remaining <= 0,
      msRemaining: Math.max(0, remaining),
      lastWordAt: data.created_at,
    });
  }, [user]);

  useEffect(() => {
    checkCooldown();
  }, [checkCooldown, words.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const word = input.trim();
    if (!word) {
      setError('Please enter a word.');
      return;
    }
    if (/\s/.test(word)) {
      setError('Only a single word — no spaces.');
      return;
    }
    if (word.length > 50) {
      setError('That word is too long.');
      return;
    }
    if (!cooldown?.canContribute) {
      setError('Your 24-hour cooldown has not expired yet.');
      return;
    }

    setSubmitting(true);
    const displayName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] ||
      'Anonymous';

    const { error: insertError } = await supabase.from('story_words').insert({
      word,
      author_name: displayName,
    });

    setSubmitting(false);

    if (insertError) {
      const msg = insertError.message;
      if (msg.includes('24 hours') || msg.includes('cooldown')) {
        setError('You can only add one word every 24 hours. Please wait for your cooldown to expire.');
        checkCooldown();
      } else {
        setError(msg);
      }
      return;
    }

    setSuccess(true);
    setInput('');
    refetch();
    checkCooldown();
    setTimeout(() => setSuccess(false), 4000);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-texture">
        <div className="flex items-center gap-3 text-ink-400 dark:text-ink-400">
          <div className="h-2 w-2 rounded-full bg-ink-300 dark:bg-ink-500 animate-pulse" />
          <span className="font-sans text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Writer';

  const msRemaining = cooldown?.msRemaining ?? 0;
  const hours = Math.floor(msRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);

  return (
    <div className="min-h-screen paper-texture">
      <Header wordCount={words.length} onTitleClick={() => navigate('home')} theme={theme} onToggleTheme={onToggleTheme} />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* User bar */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('profile')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full bg-ink-800 dark:bg-accent-600 text-ink-50 dark:text-white flex items-center justify-center font-serif text-sm font-medium transition-transform group-hover:scale-105">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <p className="font-sans text-sm font-medium text-ink-700 dark:text-ink-100 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                {displayName}
              </p>
              <p className="font-sans text-xs text-ink-400 dark:text-ink-500">View profile</p>
            </div>
          </button>
          <button
            onClick={async () => {
              await signOut();
              navigate('home');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-ink-500 dark:text-ink-400 hover:text-ink-800 dark:hover:text-ink-100 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors font-sans text-sm"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.5} />
            Sign out
          </button>
        </div>

        {/* Contribution form */}
        <div className="bg-white/70 dark:bg-ink-900/70 backdrop-blur-sm border border-ink-200/50 dark:border-ink-800/60 rounded-2xl p-8 shadow-lg shadow-ink-800/5 dark:shadow-black/20 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Feather className="w-5 h-5 text-accent-500 dark:text-accent-400" strokeWidth={1.5} />
            <h2 className="font-serif text-2xl font-medium text-ink-800 dark:text-ink-100">Add Your Word</h2>
          </div>
          <p className="font-sans text-sm text-ink-500 dark:text-ink-400 mb-6">
            Choose carefully — you only get one word every 24 hours.
          </p>

          {/* Cooldown banner */}
          {cooldown && !cooldown.canContribute && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-ink-100 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 mb-5">
              <Clock className="w-5 h-5 text-ink-500 dark:text-ink-300 shrink-0" strokeWidth={1.5} />
              <div className="flex-1">
                <p className="font-sans text-sm text-ink-600 dark:text-ink-300">
                  Your next word is available in
                </p>
                <p className="font-serif text-lg font-semibold text-ink-800 dark:text-ink-100 tabular-nums">
                  {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
          )}

          {cooldown?.canContribute && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-50 dark:bg-accent-900/30 border border-accent-200 dark:border-accent-800 mb-5">
              <Check className="w-4 h-4 text-accent-600 dark:text-accent-400" strokeWidth={2} />
              <p className="font-sans text-sm text-accent-700 dark:text-accent-300">
                You can add a word now.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a single word…"
                disabled={submitting || !cooldown?.canContribute}
                maxLength={50}
                autoFocus
                className="w-full px-5 py-4 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:focus:ring-accent-800 outline-none font-serif text-lg text-ink-800 dark:text-ink-100 placeholder:text-ink-300 dark:placeholder:text-ink-600 transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="font-sans text-sm text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200">
                <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" strokeWidth={2} />
                <p className="font-sans text-sm text-green-700">
                  Your word has been added to the story. See you in 24 hours.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !cooldown?.canContribute || !input.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ink-800 text-ink-50 font-sans text-base font-medium hover:bg-ink-900 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-ink-800/10"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-ink-200 dark:border-ink-600 border-t-ink-50 dark:border-t-white rounded-full animate-spin" />
                  <span>Adding…</span>
                </>
              ) : (
                <>
                  <Feather className="w-4 h-4" strokeWidth={1.5} />
                  <span>Add to the Story</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Story */}
        <div className="relative rounded-2xl bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm border border-ink-200/50 dark:border-ink-800/60 shadow-xl shadow-ink-800/5 dark:shadow-black/30 p-8 md:p-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-ink-800 dark:bg-ink-100 text-ink-50 dark:text-ink-900 text-xs font-sans uppercase tracking-widest">
            The Story So Far
          </div>
          <StoryDisplay words={words} loading={storyLoading} highlightLast />
        </div>

        <button
          onClick={() => navigate('home')}
          className="mt-8 inline-flex items-center gap-2 text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors font-sans text-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to home
        </button>
      </div>
    </div>
  );
}
