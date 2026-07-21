import '@testing-library/jest-dom/vitest';

// Mock matchMedia (used by RoleCarousel, useReveal, useActiveSection)
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

// Mock IntersectionObserver (used by useReveal, useActiveSection, Background)
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
