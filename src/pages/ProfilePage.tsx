import { useEffect, useState, useCallback } from 'react';
import { User, Mail, LogOut, Check, ArrowLeft, Loader2, BadgeCheck, BookOpen, Feather } from 'lucide-react';
import { Header } from '../components/Header';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useStory } from '../lib/useStory';
import type { Route } from '../lib/router';

type Props = {
  navigate: (r: Route) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function ProfilePage({ navigate, theme, onToggleTheme }: Props) {
  const { user, signOut, loading: authLoading } = useAuth();
  const { words } = useStory();

  const [displayName, setDisplayName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const [wordCount, setWordCount] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate('signin');
  }, [authLoading, user, navigate]);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(t);
  }, []);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .maybeSingle();
    if (data?.display_name) {
      setDisplayName(data.display_name);
    } else {
      setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Anonymous');
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const loadWordCount = useCallback(async () => {
    if (!user) return;
    const { count } = await supabase
      .from('story_words')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    setWordCount(count ?? 0);
  }, [user]);

  useEffect(() => {
    loadWordCount();
  }, [loadWordCount]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      setError('Username must be at least 2 characters.');
      return;
    }
    if (trimmed.length > 30) {
      setError('Username must be 30 characters or fewer.');
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ display_name: trimmed })
      .eq('id', user!.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    await supabase.auth.updateUser({ data: { full_name: trimmed } });

    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('home');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-texture">
        <div className="flex items-center gap-3 text-ink-400 dark:text-ink-400">
          <div className="h-2 w-2 rounded-full bg-ink-300 dark:bg-ink-500 animate-pulse" />
          <span className="font-sans text-sm">Loading…</span>
        </div>
      </div>
    );
  }

  const email = user.email ?? '';
  const emailVerified = user.email_confirmed_at != null;
  const initial = (displayName || 'A').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen paper-texture">
      <Header wordCount={words.length} onTitleClick={() => navigate('home')} theme={theme} onToggleTheme={onToggleTheme} />

      <div className="max-w-2xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate('contribute')}
          className="inline-flex items-center gap-2 text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors mb-8 font-sans text-sm"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          Back to contributing
        </button>

        <div
          className={`transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-ink-400 dark:text-ink-400 mb-4">
            Your Profile
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-light text-ink-800 dark:text-ink-100 leading-tight mb-8">
            Account settings
          </h1>

          {/* Profile card */}
          <div className="bg-white/70 dark:bg-ink-900/70 backdrop-blur-sm border border-ink-200/50 dark:border-ink-800/60 rounded-2xl p-8 shadow-lg shadow-ink-800/5 dark:shadow-black/20">
            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-ink-800 dark:bg-accent-600 text-ink-50 dark:text-white flex items-center justify-center font-serif text-2xl font-medium shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                {editing ? (
                  <form onSubmit={handleSave} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-ink-500" strokeWidth={1.5} />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          maxLength={30}
                          autoFocus
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-ink-50 dark:bg-ink-800 border border-ink-200 dark:border-ink-700 focus:border-accent-400 focus:ring-2 focus:ring-accent-200 dark:focus:ring-accent-800 outline-none font-sans text-sm text-ink-800 dark:text-ink-100 transition-all"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-ink-800 dark:bg-accent-600 text-ink-50 dark:text-white hover:bg-ink-900 dark:hover:bg-accent-500 transition-all disabled:opacity-50 shrink-0"
                      >
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                        ) : (
                          <Check className="w-4 h-4" strokeWidth={2} />
                        )}
                      </button>
                    </div>
                    {error && (
                      <p className="font-sans text-sm text-red-600 dark:text-red-400">{error}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setError(null);
                        loadProfile();
                      }}
                      className="font-sans text-xs text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-ink-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-xl font-medium text-ink-800 dark:text-ink-100 truncate">
                        {displayName}
                      </h2>
                      {saved && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-sans text-xs">
                          <Check className="w-3 h-3" strokeWidth={2.5} />
                          Saved
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setEditing(true)}
                      className="font-sans text-sm text-accent-600 dark:text-accent-400 hover:underline mt-0.5"
                    >
                      Change username
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Info rows */}
            <div className="space-y-1">
              {/* Email row */}
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-ink-50 dark:bg-ink-800/60">
                <Mail className="w-4 h-4 text-ink-400 dark:text-ink-500 shrink-0" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500">Email address</p>
                  <p className="font-sans text-sm text-ink-700 dark:text-ink-200 truncate">{email}</p>
                </div>
                {emailVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 font-sans text-xs whitespace-nowrap">
                    <BadgeCheck className="w-3.5 h-3.5" strokeWidth={2} />
                    Verified
                  </span>
                )}
              </div>

              {/* Words contributed row */}
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-ink-50 dark:bg-ink-800/60">
                <Feather className="w-4 h-4 text-ink-400 dark:text-ink-500 shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500">Words contributed</p>
                  <p className="font-sans text-sm text-ink-700 dark:text-ink-200">
                    {wordCount === null ? '—' : wordCount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Member since row */}
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-ink-50 dark:bg-ink-800/60">
                <BookOpen className="w-4 h-4 text-ink-400 dark:text-ink-500 shrink-0" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="font-sans text-xs text-ink-400 dark:text-ink-500">Member since</p>
                  <p className="font-sans text-sm text-ink-700 dark:text-ink-200">
                    {new Date(user.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Sign out */}
            <button
              onClick={handleSignOut}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-sans text-sm font-medium"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.5} />
              Sign out
            </button>
          </div>

          {/* Quick nav */}
          <div className="mt-6 flex items-center justify-center gap-6">
            <button
              onClick={() => navigate('contribute')}
              className="inline-flex items-center gap-2 font-sans text-sm text-ink-500 dark:text-ink-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              <Feather className="w-4 h-4" strokeWidth={1.5} />
              Contribute a word
            </button>
            <span className="text-ink-200 dark:text-ink-700">|</span>
            <button
              onClick={() => navigate('home')}
              className="inline-flex items-center gap-2 font-sans text-sm text-ink-500 dark:text-ink-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              <BookOpen className="w-4 h-4" strokeWidth={1.5} />
              Read the story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
