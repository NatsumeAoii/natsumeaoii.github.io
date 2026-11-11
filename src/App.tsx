import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

export default function App() {
    const { t } = useSettings();

    return (
        <ErrorBoundary>
            <BrowserRouter>
                <a href="#main-content" className="skip-link">
                    {t.a11y.skipToContent}
                </a>

                <div className="sheet">
                    <Nav />
                    <main id="main-content" className="sheet-main" tabIndex={-1}>
                        <Suspense fallback={null}>
                            <Routes>
                                <Route path="/" element={<PortfolioPage />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Suspense>
                        <Footer />
                    </main>
                </div>

                <BackToTop />
            </BrowserRouter>
        </ErrorBoundary>
    );
}
