import { useEffect, useState } from 'react';

export type Route = 'home' | 'signin' | 'contribute' | 'profile' | 'privacy' | 'terms';

function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '');
  if (h === 'signin') return 'signin';
  if (h === 'contribute') return 'contribute';
  if (h === 'profile') return 'profile';
  if (h === 'privacy') return 'privacy';
  if (h === 'terms') return 'terms';
  return 'home';
}

export function useRouter() {
  const [route, setRoute] = useState<Route>(parseHash());

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (r: Route) => {
    window.location.hash = r === 'home' ? '/' : `/${r}`;
  };

  return { route, navigate };
}
