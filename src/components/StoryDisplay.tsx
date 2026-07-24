import { useEffect, useRef } from 'react';
import type { StoryWord } from '../lib/supabase';

type Props = {
  words: StoryWord[];
  loading: boolean;
  highlightLast?: boolean;
};

export function StoryDisplay({ words, loading, highlightLast = false }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest word when new ones arrive
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [words.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-ink-400 dark:text-ink-400">
          <div className="h-2 w-2 rounded-full bg-ink-300 dark:bg-ink-500 animate-pulse" />
          <span className="font-sans text-sm tracking-wide">Unfolding the story…</span>
        </div>
      </div>
    );
  }

  if (words.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl text-ink-400 dark:text-ink-500 italic">
          The page is blank. The story has not yet begun.
        </p>
        <p className="mt-3 font-sans text-sm text-ink-300 dark:text-ink-600">
          Be the first to write a word.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="max-h-[55vh] overflow-y-auto pr-2 leading-relaxed"
    >
      <p className="font-serif text-xl md:text-2xl text-ink-800 dark:text-ink-100 leading-loose">
        {words.map((w, i) => {
          const needsSpaceBefore = i > 0 && !/^[.,!?;:]/.test(w.word);
          const isLast = i === words.length - 1;
          return (
            <span
              key={w.id}
              className={`word-appear inline-block ${isLast && highlightLast ? 'text-accent-600 dark:text-accent-400 font-medium' : ''}`}
              style={{ animationDelay: isLast ? '0.1s' : '0s' }}
              title={`${w.author_name} · ${new Date(w.created_at).toLocaleString()}`}
            >
              {needsSpaceBefore ? ' ' : ''}
              {w.word}
            </span>
          );
        })}
        <span className="cursor-blink text-accent-500 font-serif font-medium">|</span>
      </p>
      <div ref={endRef} />
    </div>
  );
}
