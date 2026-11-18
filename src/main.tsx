import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SettingsProvider } from './context/settings.tsx';
import { getRedirectPath } from './redirect.ts';
import './index.css';

// GitHub Pages SPA redirect: the 404.html page sends the original path in
// ?redirect=. Restore it before render so App's path check sees the real URL.
(function () {
    const redirectPath = getRedirectPath(window.location.search, window.location.origin);
    if (!redirectPath) return;
    try {
        history.replaceState(null, '', redirectPath);
    } catch {
        // Some environments reject replaceState; keep the current URL and let
        // App render the 404 view instead of crashing before mount.
    }
})();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SettingsProvider>
            <App />
        </SettingsProvider>
    </StrictMode>,
);
