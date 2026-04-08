# Colleague Handoff v1

**Repository:** 10-business-law-accounting
**Date:** 2026-04-08

---

## Quick Start

```bash
# 1. Clone the repo
git clone <repo-url>
cd 10-business-law-accounting

# 2. Install dependencies (requires pnpm)
pnpm install

# 3. Build everything
pnpm run build

# 4. Start the app
cd 3-Applications-Control-Towers/Commercial-Control-Tower
pnpm run dev
# App available at http://localhost:3000
```

---

## How to Install Dependencies

This is a **pnpm workspace monorepo**. Use `pnpm install` at the repo root — it installs dependencies for all workspace packages at once.

```bash
# From repo root
pnpm install
```

If you don't have pnpm: `npm install -g pnpm`

Required: **Node.js 20.x**

---

## How to Run Locally

```bash
cd 3-Applications-Control-Towers/Commercial-Control-Tower
pnpm run dev
```

Opens at `http://localhost:3000`.

---

## How to Build

```bash
# From repo root — builds all packages
pnpm run build

# Or just the app
cd 3-Applications-Control-Towers/Commercial-Control-Tower
pnpm run build
```

The build uses **Turbo** to orchestrate workspace package builds in the correct order.

---

## Package Boundaries

```
10-business-law-accounting/
├── 1-Governance-Registry-Runtime/    # Governance layer (Contracts, Registry, Runtime)
├── 2-Engines-Tools-Datasets/         # Domain engines and shared types
│   ├── Domain-Objects/               # @10-bla/domain-objects — core types
│   ├── Workflows/                    # @10-bla/workflows — workflow defs
│   ├── Law-Kernel/                   # Legal domain logic
│   ├── Business-Kernel/              # Business domain logic
│   ├── Accounting-Kernel/            # Accounting domain logic
│   └── ...                           # Other domain packages
├── 3-Applications-Control-Towers/
│   ├── Commercial-Control-Tower/     # THE MAIN APP (Next.js)
│   └── Shared-UI/                    # Shared UI components
├── 4-Workers-Relays-Assistants/      # Background workers
├── docs/                             # Documentation
├── .validkernel/                     # Governance tooling (ignore for app dev)
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml               # Workspace package declarations
└── turbo.json                        # Build orchestration config
```

### Where the App Lives

`3-Applications-Control-Towers/Commercial-Control-Tower/` — This is the Next.js application.

### Where Shared Domain Objects Live

`2-Engines-Tools-Datasets/Domain-Objects/` — Imported as `@10-bla/domain-objects`.

---

## What to Do If Vercel / Next Build Fails

1. **Run locally first:** `pnpm run build` from the repo root
2. **Check for TypeScript errors:** The most common failure is a type mismatch in `@10-bla/domain-objects`
3. **Check lockfile sync:** If you added a dependency, run `pnpm install` and commit `pnpm-lock.yaml`
4. **Check Vercel root directory:** Vercel project must point to `3-Applications-Control-Towers/Commercial-Control-Tower`
5. **Check Node version:** Vercel should use Node 20.x

---

## What Not to Change Casually

- `pnpm-workspace.yaml` — Defines which directories are workspace packages
- `turbo.json` — Defines build dependency graph
- `2-Engines-Tools-Datasets/Domain-Objects/src/index.ts` — Core type exports consumed by all packages
- `3-Applications-Control-Towers/Commercial-Control-Tower/next.config.js` — Contains `transpilePackages` for workspace deps

---

## Governance Files (Safe to Ignore for App Development)

The `.validkernel/` directory and `docs/validkernel/` contain governance tooling from the ValidKernel ecosystem. These do not affect the application build. You can safely ignore them for day-to-day development.

---

*END OF DOCUMENT*
