import { useEffect } from 'react';
import { HomePage } from './pages/home';
import { Route, Router } from 'wouter';
import { QuizPage } from './pages/quiz';
import { DashboardPage } from './pages/dashboard';
import { Providers } from './providers';

export function App() {
  useEffect(() => {
    const setFavicon = (isDarkMode: boolean) => {
      const favicon = document.getElementById('icon') as HTMLLinkElement;
      if (!favicon) return;
      favicon.href = isDarkMode ? '/icon-dark.svg' : '/icon-light.svg';
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setFavicon(mediaQuery.matches);

    mediaQuery.addEventListener('change', e => {
      setFavicon(e.matches);
    });
  }, []);

  return (
    <Providers>
      <Router>
        <Route path='/' component={HomePage} />
        <Route path='/quiz' component={QuizPage} />
        <Route path='/dashboard' component={DashboardPage} />
      </Router>
    </Providers>
  );
}
