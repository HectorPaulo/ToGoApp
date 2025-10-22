import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
    theme: Theme;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
    colors: {
        background: string;
        card: string;
        text: string;
        border: string;
        primary: string;
    };
};

const STORAGE_KEY = 'app-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>('light');

    useEffect(() => {
        const load = async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored === 'dark' || stored === 'light') {
                    setThemeState(stored);
                }
            } catch (e) {
                console.log('Error loading theme', e);
            }
        };
        load();
    }, []);

    useEffect(() => {
        const save = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, theme);
            } catch (e) {
                console.log('Error saving theme', e);
            }
        };
        save();
    }, [theme]);

    const setTheme = (t: Theme) => setThemeState(t);
    const toggleTheme = () => setThemeState((s) => (s === 'light' ? 'dark' : 'light'));

    const colors = theme === 'dark'
        ? {
            background: '#1e1e1e',
            card: '#121212',
            text: '#ffffff',
            border: '#222222',
            primary: '#8ab4f8',
        }
        : {
            background: '#fff',
            card: '#ffffff',
            text: '#111827',
            border: '#e5e7eb',
            primary: '#322a6aff',
        };

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
    return ctx;
};

export default ThemeProvider;
