import React, { useState, useEffect, useMemo } from 'react';
import Bootscreen from './Components/Bootscreen';
import Desktop from './Components/Desktop';

export default function App() {
  // themePreference: "system" | "light" | "dark"
  const [themePreference, setThemePreference] = useState(() => {
    return sessionStorage.getItem('mac_portfolio_theme') || 'system';
  });

  useEffect(() => {
    sessionStorage.setItem('mac_portfolio_theme', themePreference);
  }, [themePreference]);
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [isBooting, setIsBooting] = useState(true);

  // Listen for OS theme changes so "system" mode responds in real-time
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => setSystemTheme(e.matches ? 'dark' : 'light');
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Derive the actual theme to use
  const theme = useMemo(() => {
    if (themePreference === 'system') return systemTheme;
    return themePreference;
  }, [themePreference, systemTheme]);

  return (
    <>
      {isBooting ? (
        <Bootscreen theme={theme} onComplete={() => setIsBooting(false)} />
      ) : (
        <Desktop 
          theme={theme} 
          themePreference={themePreference}
          setThemePreference={setThemePreference} 
        />
      )}
    </>
  );
}