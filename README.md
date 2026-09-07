# ComplyOS

AI-native compliance and business operations dashboard for Indian SMEs —
GST, TDS, PF, ESIC, ROC filings, compliance calendar, document AI, and finance
in one place. Built with TanStack Start (React + Vite + Tailwind) and Neon
serverless Postgres.

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| [Bun](https://bun.sh) | 1.x (verified with 1.3.14) | `bun --version` |
| Node.js | 18+ (verified with 22.x; only needed as a fallback runtime) | `node --version` |
| Git | any recent | `git --version` |
| A Neon Postgres database | free tier works | https://console.neon.tech |

> Bun is the primary runtime and package manager — all commands below use
> `bun`. `bun install` reads `bun.lock`, so installs are reproducible.

## 1. Clone and install

```bash
git clone https://github.com/chiragsd-coding/ComplyOS.git
cd ComplyOS
bun install
```

## 2. Environment variables

Copy the template and fill it in:

```bash
cp .env.example .env
```

| Variable | Required | Where to get it |
|----------|----------|-----------------|
| `DATABASE_URL` | **Yes** | Neon console → your project → Connection Details → pooled connection string. Format: `postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require` |

Notes:

- Bun auto-loads `.env` — no extra tooling needed.
- `.env` is gitignored. Never commit real credentials.
- `DATABASE_URL` is the **only** runtime env var the app reads (see
  `src/db.ts` and `src/lib/db.ts`). There are no API keys or secrets beyond it.

## 3. Database setup (Neon Postgres)

No migration tool or manual SQL is needed:

1. Create a free project at https://console.neon.tech (region closest to
   your users, e.g. Asia Pacific).
2. Copy the pooled connection string into `.env` as `DATABASE_URL`.
3. Start the app — on the first authenticated request, `initSchema()` in
   `src/lib/db.ts` runs `CREATE TABLE IF NOT EXISTS` for all five tables
   (`users`, `sessions`, `compliance_tasks`, `documents`, `invoices`). It is
   idempotent and safe to run on every cold start.

There are no seed scripts to run manually. Demo compliance deadlines are
seeded per-user from inside the app via the `seedComplianceTasks` server
function (`src/lib/compliance.ts`) the first time a user opens the compliance
page; it skips seeding if that user already has tasks.

## 4. Run the dev server

```bash
bun run dev
```

- Serves on **http://localhost:3000** (port/host configured in
  `vite.config.ts`; `allowedHosts: true` so reverse proxies don't trigger
  "Blocked request" errors).
- Hot-reloads on file changes.
- Open http://localhost:3000, sign up at `/signup`, then explore
  `/dashboard`, `/compliance`, `/documents`, `/finance`.

## 5. Build and run for production

```bash
bun run build   # vite build → dist/client + dist/server
bun run start   # serves the build on 0.0.0.0:3000 via serve.ts
```

`serve.ts` binds port `3000` on all interfaces and frees the port before
binding, so re-running it safely replaces any previous instance.

On the team sandbox, `bun run publish` (build + start + health-check) is the
one-step deploy to port 3000; `bun run go-live` deploys to Vercel (requires
`VERCEL_TOKEN`, and passes `DATABASE_URL` through as a runtime env var —
see `go-live.sh`).

## 6. Tests / lint / typecheck

There is currently **no test runner, linter, or typecheck script** in
`package.json` (verified — the only scripts are `dev`, `build`, `start`,
`publish`, `go-live`, and `format`). Available checks:

```bash
bun run format   # prettier --write . (formatting only)
```

TypeScript strictness is enforced by config (`tsconfig.json`: `strict`,
`noUnusedLocals`, `noUnusedParameters`) and surfaces at build time via
`bun run build`. Adding `vitest`/`eslint` is a planned follow-up, not part of
this repo yet.

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| `DATABASE_URL is not set` on signup / any data page | `.env` missing or var unset | `cp .env.example .env`, paste the Neon pooled string, restart the dev server |
| DB connection errors / timeouts | Wrong string, unpooled host, or Neon project paused | Re-copy the **pooled** connection string from the Neon console (must include `?sslmode=require`); resume the project if paused |
| `EADDRINUSE` / port 3000 already in use | Another dev server or `bun run start` running | Stop the other process, or free the port: `lsof -tiTCP:3000 -sTCP:LISTEN \| xargs -r kill` then retry |
| Blank page after `bun run start` | Build is stale or missing | Re-run `bun run build` first — `start` serves `dist/`, it does not rebuild |
| `bun install` fails | Stale lockfile / network hiccup | `rm -rf node_modules bun.lock && bun install` (re-generates the lockfile), then retry |
| Type errors only appear at build | No watch-mode typecheck configured | Run `bun run build` to surface them; fix until the build is green |

## Project structure

```
src/
  routes/        # Pages: index (landing), login, signup, dashboard,
                 #        compliance, documents, finance
  lib/           # Server functions: auth.ts, compliance.ts,
                 #        documents.ts, db.ts (Neon client + initSchema)
  db.ts          # Alternate Neon client helper
  routes/api/    # API routes (if any)
serve.ts         # Production static + SSR server (port 3000)
publish.sh       # Sandbox deploy: install → build → start → health-check
go-live.sh       # Vercel deploy script
```
