# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Playwright end-to-end test project written in TypeScript. Tests run in a Docker container on GitHub Actions for every push and pull request.

## Commands

```bash
pnpm install            # Install dependencies
pnpm test               # Run tests headlessly (Chromium)
pnpm test:headed        # Run tests with browser UI visible
pnpm test:ui            # Open Playwright interactive UI
pnpm lint               # ESLint with TypeScript type-checking
pnpm format             # Prettier formatting
```

Run a single test file:
```bash
pnpm exec playwright test tests/smoke/homepage.spec.ts
```

Run a single test by name:
```bash
pnpm exec playwright test -g "page title"
```

## Architecture

```
tests/smoke/            # Smoke test specs (.spec.ts) covering homepage, categories, product, cart, auth
playwright.config.ts    # Single Chromium project; BASE_URL env var (default: https://www.demoblaze.com)
Dockerfile              # Uses mcr.microsoft.com/playwright image; runs npm ci then tests
.devcontainer/          # Dev container using same image; forwards port 9323 for Playwright UI
.github/workflows/      # playwright.yml: builds Docker image, runs container, uploads HTML report
```

**How CI works:** GitHub Actions builds the Docker image, runs the container with `playwright-report/` and `test-results/` mounted as volumes, then uploads the HTML report as an artifact (kept 30 days).

**Environment variables:**
- `BASE_URL` — target URL for tests (default: `https://www.demoblaze.com`)
- `TEST_USERNAME` / `TEST_PASSWORD` — credentials for auth smoke tests (fallback: `demo_user` / `demo_password`)
- `CI` — set automatically by GitHub Actions; enables 2 retries and stricter reporter settings

## Key Config Defaults

- Retries: 2 on CI, 0 locally
- Screenshots: on failure
- Video: on first retry
- Browser: Chromium only (add Firefox/WebKit projects in `playwright.config.ts` if needed)
