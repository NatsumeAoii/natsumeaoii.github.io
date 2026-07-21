import {
    createContext,
    type Context,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { translations, type Locale, type Translation } from '../i18n';

type Theme = 'light' | 'dark';

const THEME_KEY = 'portfolio-theme';
const LOCALE_KEY = 'portfolio-locale';

interface SettingsValue {
    theme: Theme;
    locale: Locale;
    t: Translation;
    toggleTheme: () => void;
    setLocale: (locale: Locale) => void;
    toggleLocale: () => void;
}

// ponytail: globalThis cache prevents HMR from creating duplicate contexts.
const g = globalThis as Record<string, unknown>;
const SettingsContext: Context<SettingsValue | null> =
    (g.__settingsCtx as Context<SettingsValue | null>) ??
    (g.__settingsCtx = createContext<SettingsValue | null>(null));

/**
 * Read the value that the inline FOUC-prevention script already applied to
 * `<html data-initial-theme="…">`. This keeps React state in sync with the
 * pre-paint initialization without duplicating the detection logic.
 *
 * If the attribute is missing (SSR, test harness, or very old cached HTML),
 * fall back to a safe default.
 */
function getInitialTheme(): Theme {
    if (typeof document !== 'undefined') {
        const attr = document.documentElement.getAttribute('data-initial-theme');
        if (attr === 'light' || attr === 'dark') return attr;
    }
    return 'dark';
}

function getInitialLocale(): Locale {
    if (typeof document !== 'undefined') {
        const attr = document.documentElement.getAttribute('data-initial-locale');
        if (attr === 'en' || attr === 'id') return attr;
    }
    return 'en';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);
    const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            window.localStorage.setItem(THEME_KEY, theme);
        } catch {
            // ignore persistence failures
        }
    }, [theme]);

    useEffect(() => {
        document.documentElement.setAttribute('lang', locale);
        try {
            window.localStorage.setItem(LOCALE_KEY, locale);
        } catch {
            // ignore persistence failures
        }
    }, [locale]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
    const toggleLocale = useCallback(() => {
        setLocaleState((prev) => (prev === 'en' ? 'id' : 'en'));
    }, []);

    const value = useMemo<SettingsValue>(
        () => ({
            theme,
            locale,
            t: translations[locale],
            toggleTheme,
            setLocale,
            toggleLocale,
        }),
        [theme, locale, toggleTheme, setLocale, toggleLocale],
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsValue {
    const ctx = useContext(SettingsContext);
    if (!ctx) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return ctx;
}
