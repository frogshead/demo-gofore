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
# bash/zsh
docker build -t demo-gofore .
docker run --rm demo-gofore
```

```nu
# Nushell
docker build -t demo-gofore .
docker run --rm demo-gofore
```

Mount report directories to retrieve results locally:

```bash
# bash/zsh
docker run --rm \
  -v $(pwd)/playwright-report:/app/playwright-report \
  -v $(pwd)/test-results:/app/test-results \
  demo-gofore
```

```nu
# Nushell — (pwd) instead of $(pwd)
docker run --rm -v $"(pwd)/playwright-report:/app/playwright-report" -v $"(pwd)/test-results:/app/test-results" demo-gofore
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

The `.devcontainer` setup gives you a fully configured Playwright environment inside VS Code without installing Node, pnpm, or any browsers locally.

### Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) running
- VS Code with the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension installed

### Opening the project in a container

1. Open the repo folder in VS Code
2. VS Code detects `.devcontainer/devcontainer.json` and shows a popup — click **Reopen in Container**
   - Alternatively: open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) → **Dev Containers: Reopen in Container**
3. VS Code pulls `mcr.microsoft.com/playwright:latest`, starts the container, and runs `pnpm install` automatically
4. The workspace opens inside the container — all terminals, tasks, and extensions run there

### What's pre-installed

| Thing | Detail |
|---|---|
| Playwright + all browsers | Bundled in the base image — no separate `npx playwright install` needed |
| Node.js & pnpm | Installed automatically via `postCreateCommand` |
| ESLint extension | Inline lint errors as you type |
| Prettier extension | Format on save, using project `.prettierrc` |
| Playwright Test for VS Code | Run and debug individual tests from the Test Explorer sidebar |
| TypeScript SDK | Pointed at `node_modules/typescript/lib` for accurate type checking |

### Running tests from inside the container

Use the integrated terminal (`` Ctrl+` ``) or the Playwright Test panel in the sidebar.

```bash
pnpm test                          # run all tests headlessly
pnpm exec playwright test tests/smoke/homepage.spec.ts   # single file
pnpm exec playwright test --project=chromium             # single browser
```

### Playwright interactive UI

```bash
pnpm test:ui
```

This starts the Playwright UI server on port `9323`. The dev container forwards that port automatically — VS Code shows a notification with an **Open in Browser** link, or you can open `http://localhost:9323` directly. From the UI you can filter, run, and time-travel debug individual tests.

### Headed mode (GUI browser)

Headed mode requires a display server, which is not available inside the container by default. For visual debugging, use `pnpm test:ui` (browser-in-browser) instead, or run headed tests on your host machine outside the container.

## Playwright agents (AI-assisted testing)

Playwright agents are AI helpers that automate three phases of test work. They are configured for use with **Claude Code** and require Playwright 1.56+.

### The three agents

| Agent | What it does |
|---|---|
| **Planner** | Explores the live app and writes a structured Markdown test plan to `specs/` |
| **Generator** | Reads a plan from `specs/` and writes executable `.spec.ts` files to `tests/` |
| **Healer** | Runs failing tests, inspects traces, and permanently rewrites broken selectors or assertions |

### Setup

Agent definitions and MCP configuration were generated by running:

```bash
npx playwright init-agents --loop=claude
```

This produced:

```
.claude/agents/playwright-test-planner.md
.claude/agents/playwright-test-generator.md
.claude/agents/playwright-test-healer.md
.mcp.json                    # MCP server config for Claude Code
specs/                       # directory for Markdown test plans
tests/seed.spec.ts           # baseline starting state for agents
```

The `.mcp.json` file tells Claude Code to start a local MCP server that gives agents direct access to Playwright's browser tooling. No extra configuration is needed — it is picked up automatically when you open this project in Claude Code.

> **After upgrading Playwright**, regenerate agent definitions to pick up updated tools:
> ```bash
> npx playwright init-agents --loop=claude
> ```

### The seed file

`tests/seed.spec.ts` defines the baseline state that Generator and Healer agents use as their starting point. The current seed navigates to the Demoblaze homepage and waits for the product grid to load. Update it if the app requires authentication or other setup before tests can run.

### Using the agents

All agents are invoked through Claude Code in natural language.

**Plan** a new feature's tests:

```
Use the planner agent to create a test plan for the checkout flow and save it to specs/checkout-plan.md
```

**Generate** tests from a plan:

```
Use the generator agent to create tests from specs/checkout-plan.md
```

**Heal** failing tests:

```
Use the healer agent to fix all failing tests in tests/
```

The Planner and Generator work against the live site (`BASE_URL`), so the app must be reachable when they run. The Healer needs a passing seed test and readable trace files (`trace: 'on-first-retry'` is already configured).

### File layout

```
specs/          # Markdown test plans — version-control these alongside tests
tests/          # Generated and hand-written .spec.ts files
tests/seed.spec.ts   # Baseline state — keep this passing at all times
```

Review generated tests before merging, the same way you would any code contribution.
