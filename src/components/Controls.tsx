import { useSettings } from '../context/settings';
import { MoonIcon, SunIcon } from './icons';

/** Theme toggle button: sun in dark mode (tap for light), moon in light mode. */
export function ThemeToggle() {
    const { theme, toggleTheme, t } = useSettings();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? t.a11y.switchToLight : t.a11y.switchToDark}
            title={isDark ? t.a11y.switchToLight : t.a11y.switchToDark}
            className="control-btn"
        >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
    );
}

/** Language toggle button: shows the language you will switch to. */
export function LanguageSwitcher() {
    const { locale, toggleLocale, t } = useSettings();
    const isEnglish = locale === 'en';
    const code = isEnglish ? 'ID' : 'EN';
    const label = isEnglish ? t.a11y.switchToIndonesian : t.a11y.switchToEnglish;

    return (
        <button
            type="button"
            onClick={toggleLocale}
            aria-label={`${label} (${code})`}
            title={label}
            className="control-btn lang-toggle"
        >
            {code}
        </button>
    );
}
