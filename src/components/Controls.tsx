import { useSettings } from '../context/settings';
import { MoonIcon, SunIcon } from './icons';

/** Theme toggle button — sun in dark mode (tap for light), moon in light mode. */
export function ThemeToggle() {
    const { theme, toggleTheme, t } = useSettings();
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? t.a11y.switchToLight : t.a11y.switchToDark}
            title={isDark ? t.a11y.switchToLight : t.a11y.switchToDark}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-elevate text-muted transition-all hover:bg-elevate-hover hover:text-accent-end"
        >
            {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
        </button>
    );
}

/** EN / ID segmented language switcher. */
export function LanguageSwitcher() {
    const { locale, setLocale, t } = useSettings();

    return (
        <div
            role="group"
            aria-label={t.a11y.toggleLanguage}
            className="flex items-center rounded-full border border-line bg-elevate p-0.5 text-xs font-semibold"
        >
            <LangButton active={locale === 'en'} onClick={() => setLocale('en')} label="EN" />
            <LangButton active={locale === 'id'} onClick={() => setLocale('id')} label="ID" />
        </div>
    );
}

interface LangButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
}

function LangButton({ active, onClick, label }: LangButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 transition-all ${active
                ? 'bg-accent-start text-white shadow-sm'
                : 'text-muted hover:text-heading'
                }`}
        >
            {label}
        </button>
    );
}
