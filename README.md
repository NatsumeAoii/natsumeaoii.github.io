# natsumeaoii.github.io

Personal portfolio site for Wardana Dwi Mulia — a single-page React app with
hero, about, experience, projects, skills, and contact sections, plus a
downloadable resume.

## Tech Stack

- **Vite** — Build tool & dev server
- **React 19** — UI library
- **TypeScript** — Type safety (strict mode)
- **Tailwind CSS v4** — Utility-first styling (with Lightning CSS engine)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Testing

```bash
npm test            # single run
npm run test:watch  # watch mode
```

## Linting

```bash
npm run lint
```

## Deployment

Deploys automatically to GitHub Pages on push to `main` via GitHub Actions.

## Project Structure

```
src/
├── main.tsx                       # Entry point — restores GitHub Pages redirects, mounts React
├── App.tsx                        # Root layout — single page plus the 404 view
├── index.css                      # Tailwind v4 theme tokens, fonts, and layout styles
├── constants.ts                   # Shared section IDs
├── redirect.ts                    # Safe ?redirect= parsing for GitHub Pages
├── vite-env.d.ts                  # Vite client type reference
├── context/
│   └── settings.tsx               # Theme + locale state and document metadata
├── hooks/
│   └── useActiveSection.ts        # Tracks which nav section is in view
├── i18n/
│   ├── types.ts                   # Shared types (Locale, Translation) and language-neutral constants
│   ├── en.ts                      # English translation object
│   ├── id.ts                      # Indonesian translation object
│   └── index.ts                   # Barrel re-export
├── components/                    # Presentational components
│   ├── About.tsx                  # About / education section
│   ├── BackToTop.tsx              # Floating back-to-top button
│   ├── Contact.tsx                # Contact form + direct channels
│   ├── Controls.tsx               # Theme toggle + language switcher
│   ├── ErrorBoundary.tsx          # React error boundary with fallback UI
│   ├── Experience.tsx             # Work experience timeline
│   ├── Footer.tsx                 # Site footer with social links
│   ├── Hero.tsx                   # Hero section with role carousel
│   ├── icons.tsx                  # Inline SVG icon components
│   ├── Nav.tsx                    # Fixed navigation bar (desktop + mobile)
│   ├── Projects.tsx               # Project list with filtering + pagination
│   ├── Section.tsx                # Reusable numbered section wrapper
│   └── Skills.tsx                 # Skills, certifications, and languages
├── pages/
│   └── NotFound.tsx               # 404 page
└── test/
    ├── setup.ts                   # Vitest setup (jsdom mocks)
    ├── App.test.tsx               # Smoke tests, routing, mobile menu
    ├── BackToTop.test.tsx         # Reduced-motion scroll behavior
    ├── Contact.test.tsx           # Form validation + mailto tests
    ├── Controls.test.tsx          # Theme, language, and metadata tests
    ├── ErrorBoundary.test.tsx     # Localized fallback tests
    ├── Experience.test.tsx        # Expand/collapse tests
    ├── Footer.test.tsx            # Footer rendering tests
    ├── Projects.test.tsx          # Filtering + pagination tests
    └── redirect.test.ts           # GitHub Pages redirect parsing tests
```

## Editing Content

All portfolio text (profile, experience, projects, skills, certifications) is
defined in the i18n layer:

- **`src/i18n/en.ts`** — English content
- **`src/i18n/id.ts`** — Indonesian content
- **`src/i18n/types.ts`** — Shared data (links, repo URLs, tags) and TypeScript interfaces

Both locale files must export a `Translation` object with identical structure.
The type system enforces this at build time.

The resume PDF is served from `public/`.
