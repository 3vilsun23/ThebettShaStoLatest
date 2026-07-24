import { BookOpen, Moon, Sun } from 'lucide-react';

type Props = {
  wordCount: number;
  onTitleClick: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
};

export function Header({ wordCount, onTitleClick, theme, onToggleTheme }: Props) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-ink-50/70 dark:bg-ink-950/70 border-b border-ink-200/50 dark:border-ink-800/60 transition-colors duration-400">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <button
          onClick={onTitleClick}
          className="flex items-center gap-2.5 group"
        >
          <BookOpen className="w-5 h-5 text-ink-500 dark:text-ink-300 group-hover:text-accent-500 transition-colors" strokeWidth={1.5} />
          <h1 className="font-serif text-xl md:text-2xl font-medium text-ink-800 dark:text-ink-100 tracking-tight ink-hover">
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
              {wordCount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
