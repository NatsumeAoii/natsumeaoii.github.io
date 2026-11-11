import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// Existing tests assert English labels. Pin the equivalent of a stored EN +
// light choice so only the first-visit test exercises the raw defaults.
beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.setAttribute('data-initial-theme', 'light');
    document.documentElement.setAttribute('data-initial-locale', 'en');
    document.documentElement.setAttribute('lang', 'en');
});

// Mock matchMedia (used by the theme provider)
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }),
});

// Mock IntersectionObserver for components that may probe it
class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
});

// Mock scrollTo (used by BackToTop)
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: () => {},
});
