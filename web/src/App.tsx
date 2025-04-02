import { useEffect } from 'react';
import LandingPage from './pages/landing';
import { Route, Router } from 'wouter';
import QuizPage from './pages/quiz';

export function App() {
  useEffect(() => {
    console.log('ran');
    const setFavicon = (isDarkMode: boolean) => {
      const favicon = document.getElementById('icon') as HTMLLinkElement;
      if (!favicon) return;
      console.log('didnt return', isDarkMode);
      favicon.href = isDarkMode ? '/icon-dark.svg' : '/icon-light.svg';
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setFavicon(mediaQuery.matches);

    mediaQuery.addEventListener('change', e => {
      setFavicon(e.matches);
    });
  }, []);

  return (
    <Router>
      <Route path='/' component={LandingPage} />
      <Route path='/quiz' component={QuizPage} />
    </Router>
  );
}
