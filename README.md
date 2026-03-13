# demo-gofore

Playwright end-to-end smoke test suite for [Demoblaze](https://www.demoblaze.com), a demo e-commerce store. Tests run across all major desktop browsers and a range of mobile/tablet profiles.

## Test coverage

| Suite | What it verifies |
|---|---|
| `homepage` | Navbar links, carousel, product grid, footer |
| `categories` | Phones / Laptops / Monitors filter navigation |
| `product` | Product page load, name/price/button visibility, add-to-cart dialog |
| `cart` | Cart page renders with table headers and Place Order button |
| `auth` | Sign up, valid login, invalid login alert, logout |

## Browser matrix

**Desktop:** Chromium, Firefox, WebKit (Safari), Edge

**Mobile:** Pixel 5, Galaxy S9+ (Chrome), iPhone 14, iPhone 14 landscape (Safari)

**Tablet:** iPad Pro 11, iPad Pro 11 landscape (Safari)

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/) (for containerised runs)

## Quick start

```bash
pnpm install
pnpm test                  # headless, all browsers
pnpm test:headed           # with visible browser UI
pnpm test:ui               # Playwright interactive UI
```

Run a single suite:

```bash
pnpm exec playwright test tests/smoke/homepage.spec.ts
```

Run a single browser only:

```bash
pnpm exec playwright test --project=chromium
```

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.demoblaze.com` | Target URL for all tests |
| `TEST_USERNAME` | `demo_user` | Username for auth smoke tests |
| `TEST_PASSWORD` | `demo_password` | Password for auth smoke tests |

## Docker

Build and run tests inside the official Playwright container:

```bash
docker build -t demo-gofore .
docker run --rm demo-gofore
```

Mount report directories to retrieve results locally:

```bash
docker run --rm \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/test-results:/app/test-results \
  demo-gofore
```

A pre-built image is published to GitHub Container Registry on every push to `main`:

```bash
docker pull ghcr.io/frogshead/demo-gofore:latest
```

## CI

Two GitHub Actions workflows run on every push and pull request to `main`:

| Workflow | What it does |
|---|---|
| **Playwright Tests** | Builds the Docker image and runs the full test suite; uploads the HTML report as an artifact (kept 30 days) |
| **Build and Publish Docker Image** | Builds the image and pushes it to GHCR with `latest`, branch, and SHA tags (push to `main` only; PRs build but do not push) |

## Dev container

A `.devcontainer` configuration is included for VS Code / GitHub Codespaces. It uses the same Playwright image and forwards port `9323` for the interactive UI (`pnpm test:ui`).
