import { Component, type ErrorInfo, type ReactNode } from 'react';

export interface ErrorBoundaryFallback {
    title: string;
    description: string;
    reload: string;
}

interface Props {
    children: ReactNode;
    fallback: ErrorBoundaryFallback;
}

interface State {
    hasError: boolean;
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
            const { fallback } = this.props;
            return (
                <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-6 text-center">
                    <h1 className="font-display text-2xl font-bold text-heading">
                        {fallback.title}
                    </h1>
                    <p className="max-w-md text-sm text-muted">
                        {fallback.description}
                    </p>
                    <button
                        type="button"
                        onClick={this.handleReload}
                        className="mt-2 border-2 border-heading bg-heading px-6 py-3 font-mono text-xs uppercase tracking-wider text-void transition-colors hover:bg-accent-mid hover:border-accent-mid"
                    >
                        {fallback.reload}
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
