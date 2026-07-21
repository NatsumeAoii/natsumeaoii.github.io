import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { About } from './components/About';
import { Background } from './components/Background';
import { BackToTop } from './components/BackToTop';
import { Contact } from './components/Contact';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { useSectionBlur } from './hooks/useSectionBlur';

const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })));

function PortfolioPage() {
    useSectionBlur();
    return (
        <>
            <Hero />
            <About />
            <Experience />
            <Projects />
            <Skills />
            <Contact />
        </>
    );
}

export default function App() {
    return (
        <ErrorBoundary>
            <BrowserRouter>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gradient-to-r focus:from-accent-start focus:to-accent-mid focus:px-6 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none"
                >
                    Skip to content
                </a>
                <Background />
                <Nav />
                <main id="main-content">
                    <Suspense fallback={null}>
                        <Routes>
                            <Route path="/" element={<PortfolioPage />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                </main>
                <Footer />
                <BackToTop />
            </BrowserRouter>
        </ErrorBoundary>
    );
}
