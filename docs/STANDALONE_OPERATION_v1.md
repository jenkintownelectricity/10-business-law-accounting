# Standalone Operation v1

**Repository:** 10-business-law-accounting
**Authority:** Armand Lefebvre — Lefebvre Design Solutions LLC
**Date:** 2026-04-08
**Posture:** REPO-SOVEREIGN

---

## This Repo Can Build and Run From Its Own Repository

No external repositories are required for core build and runtime function. All source code, workspace packages, and configuration exist within this repository.

---

## Workspace-Local Packages

| Package | Location | Role |
|---------|----------|------|
| `@10-bla/domain-objects` | `2-Engines-Tools-Datasets/Domain-Objects` | Core domain types and interfaces |
| `@10-bla/workflows` | `2-Engines-Tools-Datasets/Workflows` | Business workflow definitions |
| `@10-bla/commercial-control-tower` | `3-Applications-Control-Towers/Commercial-Control-Tower` | Main Next.js application |

Additional workspace packages exist in `1-Governance-Registry-Runtime/`, `2-Engines-Tools-Datasets/`, `3-Applications-Control-Towers/`, and `4-Workers-Relays-Assistants/` but are not required for the core application build.

---

## Required Environment Variables

None required for local development build. The application builds and runs with zero environment configuration.

For production deployment on Vercel:
- No secrets required for the current starter application
- Vercel project should point root directory to `3-Applications-Control-Towers/Commercial-Control-Tower`

---

## What Is Required

- **Node.js 20.x** (specified in `package.json` engines)
- **pnpm** (package manager, workspace-aware)
- **Turbo** (monorepo build orchestrator, installed as devDependency)

---

## What Is Optional

- ValidKernel governance infrastructure (`.validkernel/`, `docs/validkernel/`) — governance tooling, does not affect application build
- GitHub Actions workflows (`.github/workflows/`) — CI checks, not required for local build
- Test infrastructure (`jest`, `ts-jest`) — only needed if running tests

---

## What Is NOT Needed From the Broader Ecosystem

- No dependency on `00-validkernel-governance` or `00-validkernel-registry`
- No dependency on `Construction_Application_OS` or any other domain OS
- No dependency on `40-validkernel-control-plane`
- No external API calls required for build
- No shared npm registry beyond public npmjs.org

---

## Build Instructions

```bash
# Install dependencies
pnpm install

# Build all workspace packages
pnpm run build

# Build only the main application
cd 3-Applications-Control-Towers/Commercial-Control-Tower
pnpm run build
```

## Run Instructions

```bash
# Start development server
cd 3-Applications-Control-Towers/Commercial-Control-Tower
pnpm run dev

# Start production server (after build)
pnpm run start
```

---

*END OF DOCUMENT*
