import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks';

const ThemeContext = createContext(null);

const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useLocalStorage('app_theme', THEMES.LIGHT);

    useEffect(() => {
        // Apply theme to document root
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT);
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isDark: theme === THEMES.DARK,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export { THEMES };
