import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SettingsProvider } from './context/settings.tsx';
import './index.css';

// GitHub Pages SPA redirect: detect ?redirect= param from 404.html redirect,
// restore the original URL, and let the router handle it.
(function () {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
        const decoded = decodeURIComponent(redirect);
        history.replaceState(null, '', decoded);
    }
})();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </StrictMode>,
);
