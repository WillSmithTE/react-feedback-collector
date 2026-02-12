# React Feedback Collector

## Bundle Size — CRITICAL

**Current bundle: ~7.6 KB (network transfer).** This is the single most important constraint of this project. Every change MUST be evaluated for bundle size impact. The bundle size must NEVER increase beyond 7.6 KB. Before any PR, run `npm run build` and verify the output size has not grown.

Rules:
- No new dependencies. Ever. If you think you need one, you don't.
- Prefer vanilla JS/CSS over abstractions.
- Delete dead code aggressively.
- Avoid adding utilities, helpers, or abstractions unless they reduce total size.
- Inline small functions rather than importing shared helpers.
- If a change adds bytes, something else must shrink to compensate.

## Architecture

- **Component library** published to npm as `react-feedback-collector`
- Entry point: `src/index.ts`
- Components: `src/components/` — `FeedbackWidget` (main), `FeedbackPanel`, `FeedbackButton`, `ScreenshotUpload`
- Styles injected at runtime via `src/utils/styles.ts` (no external CSS files)
- Build: Vite → ESM + CJS outputs in `dist/`
- Peer deps: React >=16.8.0

## Commands

- `npm run build` — production build
- `npm test` — run tests
- `npm run typecheck` — type checking
- `npm run lint` — ESLint

## Key Conventions

- CSS class names are minified (e.g., `fb-pnl`, `fb-btn`) to save bytes
- Theme is runtime-merged via `mergeTheme()`
- 4-emoji rating system: 😞 😐 😊 🤩
- Widget posts feedback to usero.io backend

## Releases

- **Always update CHANGELOG.md** when making user-facing changes. Add an entry under the next version before committing.
- Follow [Keep a Changelog](https://keepachangelog.com/) format.
- CHANGELOG.md is linked from README and visible on npm/GitHub — keep it accurate.
