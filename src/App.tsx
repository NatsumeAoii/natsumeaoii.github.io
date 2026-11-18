import { lazy, Suspense } from 'react';
import { About } from './components/About';
import { BackToTop } from './components/BackToTop';
import { Contact } from './components/Contact';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { useSettings } from './context/settings';

const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function PortfolioPage() {
    return (
        <>
            <Hero />
            <About />
            <Projects />
            <Experience />
            <Skills />
            <Contact />
        </>
    );
}

// Single page plus a 404. The GitHub Pages 404.html redirect restores the
// original path before render, so a pathname check covers every route.
function isHomePath() {
    return window.location.pathname === '/';
}

export default function App() {
    const { t } = useSettings();
    const isHome = isHomePath();

    return (
        <ErrorBoundary fallback={t.errorBoundary}>
            <a href="#main-content" className="skip-link">
                {t.a11y.skipToContent}
            </a>

            <div id="top" className="sheet">
                <Nav />
                <main id="main-content" className="sheet-main" tabIndex={-1}>
                    <Suspense fallback={null}>
                        {isHome ? <PortfolioPage /> : <NotFound />}
                    </Suspense>
                    <Footer />
                </main>
            </div>

            <BackToTop />
        </ErrorBoundary>
    );
}
