import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { Plugin } from 'vite';

// Single-page site: fold the one CSS file into the HTML so first paint never
// waits on a stylesheet round trip. Assets stay cacheable; only CSS is inlined.
function inlineCss(): Plugin {
    return {
        name: 'inline-css',
        apply: 'build',
        enforce: 'post',
        generateBundle(_options, bundle) {
            const html = Object.values(bundle).find(
                (item) => item.type === 'asset' && item.fileName.endsWith('.html'),
            );
            if (!html || html.type !== 'asset' || typeof html.source !== 'string') return;

            let source = html.source;
            for (const [fileName, item] of Object.entries(bundle)) {
                if (item.type !== 'asset' || !fileName.endsWith('.css')) continue;

                const base = fileName.split('/').pop() ?? fileName;
                const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const link = new RegExp(
                    `<link\\b[^>]*rel="stylesheet"[^>]*href="[^"]*${escaped}"[^>]*>`,
                    'i',
                );
                if (!link.test(source)) continue;

                source = source.replace(link, `<style>${String(item.source)}</style>`);
                delete bundle[fileName];
            }
            html.source = source;
        },
    };
}

export default defineConfig({
    plugins: [react(), tailwindcss(), inlineCss()],
    base: '/',
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                },
            },
        },
    },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        exclude: ['.worktree/**', '.kilo/**', 'node_modules/**'],
    },
});
