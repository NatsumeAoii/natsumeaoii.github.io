import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

const fallbackText = {
    en: {
        title: 'Something went wrong',
        description: 'An unexpected error occurred while rendering this page. Reloading usually fixes it.',
        reload: 'Reload page',
    },
    id: {
        title: 'Terjadi kesalahan',
        description: 'Terjadi kesalahan tak terduga saat merender halaman ini. Memuat ulang biasanya dapat memperbaikinya.',
        reload: 'Muat ulang halaman',
    },
} as const;

function detectLocale(): 'en' | 'id' {
    if (typeof document !== 'undefined') {
        // Prefer the live lang attribute (kept in sync by SettingsProvider).
        const live = document.documentElement.lang;
        if (live === 'en' || live === 'id') return live;
        // Fallback to the value stamped before first paint.
        const attr = document.documentElement.getAttribute('data-initial-locale');
        if (attr === 'en' || attr === 'id') return attr;
    }
    return 'id';
}

/**
 * Catches render errors so a component crash doesn't white-screen the entire
 * portfolio. Shows a minimal fallback with a reload button.
 */
export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: unknown, info: ErrorInfo) {
        console.error('Render error caught by ErrorBoundary:', error, info.componentStack);
    }

    private handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            const lang = detectLocale();
            const text = fallbackText[lang];
            return (
                <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
                    <h1 className="font-display text-2xl font-bold text-heading">
                        {text.title}
                    </h1>
                    <p className="max-w-md text-sm text-muted">
                        {text.description}
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="mt-2 border-2 border-heading bg-heading px-6 py-3 font-mono text-xs uppercase tracking-wider text-void transition-colors hover:bg-accent-mid hover:border-accent-mid"
                    >
                        {text.reload}
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
