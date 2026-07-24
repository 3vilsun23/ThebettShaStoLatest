import { useAuth } from './lib/auth';
import { useRouter } from './lib/router';
import { useTheme } from './lib/useTheme';
import { HomePage } from './pages/HomePage';
import { SignInPage } from './pages/SignInPage';
import { ContributePage } from './pages/ContributePage';
import { ProfilePage } from './pages/ProfilePage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';

function App() {
  const { route, navigate } = useRouter();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center paper-texture">
        <div className="flex items-center gap-3 text-ink-400 dark:text-ink-400">
          <div className="h-2 w-2 rounded-full bg-ink-300 dark:bg-ink-500 animate-pulse" />
          <span className="font-sans text-sm tracking-wide">Opening the book…</span>
        </div>
      </div>
    );
  }

  if (route === 'signin') {
    return <SignInPage navigate={navigate} theme={theme} onToggleTheme={toggleTheme} />;
  }

  if (route === 'contribute') {
    return <ContributePage navigate={navigate} theme={theme} onToggleTheme={toggleTheme} />;
  }

  if (route === 'profile') {
    return <ProfilePage navigate={navigate} theme={theme} onToggleTheme={toggleTheme} />;
  }

  if (route === 'privacy') {
    return <PrivacyPage navigate={navigate} theme={theme} onToggleTheme={toggleTheme} />;
  }

  if (route === 'terms') {
    return <TermsPage navigate={navigate} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return <HomePage navigate={navigate} isSignedIn={!!user} theme={theme} onToggleTheme={toggleTheme} />;
}

export default App;
