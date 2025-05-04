import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check if user has a preferred theme already stored
  const storedTheme = localStorage.getItem('theme');
  // If not, try to use user's system preference, or default to 'light'
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  
  const [theme, setTheme] = useState(defaultTheme);
  
  // Update localStorage and apply body class when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-theme', theme);
    
    // Apply appropriate class to body element
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [theme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 