# Working Independently on the Storefront

This guide covers everything needed to develop, test, and deploy the storefront
from this repo alone, without opening the backend monorepo day-to-day.
The backend repo (`armachecafe`) is still the source of the API, the OpenAPI
contracts, and the infrastructure outputs — this doc explains exactly when you
need it and how to get values out of it.

Stack: **Next.js 14.2.5 + React 18 + Tailwind 3 + pnpm**, static export
(`output: 'export'`) deployed to **S3 + CloudFront**. Prod site:
**https://armachecafe.com**. Dev server: **http://localhost:3000**.

## 1. Prerequisites

| Tool | Version / note |
|---|---|
| Node.js | 22 (`node --version`) |
| pnpm | 11 (`pnpm --version`) |
| AWS CLI | v2, with the SSO profile configured in `~/.aws/config` (`481084557193_AdministratorAccess`) |
| Git over SSH | `git@github.com:carmanuelz/armache-storefront.git` — push/pull needs no extra auth |
| `gh` CLI (optional) | Logged in; handy for generating `GITHUB_TOKEN` (see below) |

## 2. First-time setup

```bash
git clone git@github.com:carmanuelz/armache-storefront.git
cd armache-storefront
cp .env.example .env.local   # then fill in values, see section 3
```

### 2.1 `GITHUB_TOKEN` (required for `pnpm install`)

The dependency `@armachecafe/openapi-client` is published to **GitHub Packages**
(see `.npmrc`), so every install needs a token with `read:packages` scope:

```bash
# Option A — reuse the gh CLI session (fastest):
export GITHUB_TOKEN="$(gh auth token)"

# Option B — classic PAT: github.com → Settings → Developer settings →
# Personal access tokens → classic, scope `read:packages`, then:
export GITHUB_TOKEN="ghp_..."
```

Then:

```bash
pnpm install
```

In CI this is provided automatically via `secrets.GITHUB_TOKEN` — no setup needed
there. If `pnpm install` fails with `401/403` on `npm.pkg.github.com`, your
token is missing or expired: regenerate/re-export it.

### 2.2 AWS credentials (required for contract sync and deploy)

AWS access uses **SSO**; tokens last **~1 hour**. Activate them in each new
terminal with:

```bash
source scripts/aws-login.sh
# Override profile if needed:
# AWS_SSO_PROFILE=other-profile source scripts/aws-login.sh
```

This runs `aws sso login` only when the cached token is missing/expired, then
verifies with `sts get-caller-identity`. When AWS calls later fail with
`ExpiredToken`/`InvalidToken`, just re-run the script — that is the entire
refresh flow; there is nothing else to rotate.

## 3. Environment variables

Copy `.env.example` to `.env.local` (never commit `.env.local`). All values are
`NEXT_PUBLIC_*` (shipped to the browser), so they are not secrets — but keep the
file out of git anyway.

| Variable | Current prod value | Where to verify / refresh |
|---|---|---|
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | `us-east-1_jw3PdJZAN` (customers pool) | `pulumi stack output userPoolId --stack prod` in backend `services/platform-foundation` |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | app client of the customers pool | `pulumi stack output storefrontClientId --stack prod` (same dir). `next.config.js` ships a working fallback |
| `NEXT_PUBLIC_API_URL` | `https://api.armachecafe.com` | API Gateway URL (backend `services/api-gateway` outputs). Point at a local backend while developing if needed |
| `NEXT_PUBLIC_CULQI_PUBLIC_KEY` | `pk_test_...` / `pk_live_...` | Culqi dashboard |

> `next.config.js` also bakes in fallback defaults for pool/client/API URL, so a
> missing `.env.local` still builds — but always set real values for deploy.

## 4. Contract dependency (OpenAPI)

Types in `src/types/api.ts` are **generated**, not hand-written:

- `pnpm sync:contract` downloads the spec from `s3://armache-contracts/storefront/latest/spec.yaml`
  (needs AWS creds, section 2.2) and regenerates `src/types/api.ts` via the
  `armache-sync-contract` binary shipped with `@armachecafe/openapi-client`.
- `prebuild` runs `scripts/ci-contract-guard.sh`: with AWS it syncs fresh types;
  without AWS (CI) it keeps existing types or creates a minimal stub so the
  build stays green. `src/types/api.ts` is gitignored — never commit it.

If the backend team publishes a breaking contract change, re-run
`pnpm sync:contract`, fix type errors, and commit the regenerated file together
with your changes. If the S3 download fails, your AWS token expired (re-run
`source scripts/aws-login.sh`) or the backend hasn't published the contract yet.

## 5. Daily workflow

```bash
pnpm dev          # dev server on :3000
pnpm lint         # eslint
pnpm typecheck    # tsc --noEmit
pnpm build        # runs sync:contract first, then next build → ./out
```

Tests:

```bash
pnpm exec playwright test --config=playwright.config.ts   # mocked e2e (local, baseURL :3000)
# Prod smoke (no mocks, hits https://armachecafe.com — use deliberately):
# playwright.prod.config.ts
```

`pnpm start` serves the production build locally (`next start`).

## 6. Deploy to production (S3 + CloudFront)

Prerequisites: AWS creds (section 2.2) + a completed `pnpm build` (`./out`).

```bash
source scripts/aws-login.sh
export STOREFRONT_BUCKET_NAME=<bucket>            # current: armache-storefront-site
export STOREFRONT_DISTRIBUTION_ID=<distribution>  # from Pulumi outputs (see below)
pnpm build
bash scripts/deploy.sh
```

`deploy.sh` does three things: syncs content-hashed `_next/static` assets
**without** `--delete` (old chunks stay so in-flight sessions don't 404), syncs
everything else with `--delete` + short cache, then creates a CloudFront
invalidation on `/*`.

### Getting bucket / distribution values

They live in the backend repo and only change when `platform-foundation` is
redeployed (rare). From a clone of `armachecafe`:

```bash
cd services/platform-foundation
pulumi stack output storefrontBucketName --stack prod
pulumi stack output storefrontDistributionId --stack prod
```

If a deploy fails with "No such bucket/distribution", re-read these outputs —
the infra moved and your env vars are stale.

## 7. Pushing changes (git)

```bash
git checkout -b feat/<short-name>
# ... work, commit (Conventional Commits: feat:, fix:, docs:, chore: ...)
git push -u origin feat/<short-name>
```

SSH auth (`git@github.com:...`) needs no token refresh — if `git push` fails it
is an SSH-key/agent issue, not a credential-expiry issue. Opening a PR to `main`
triggers CI (install → lint → typecheck → build → mocked Playwright).

## 8. What still lives in the backend repo

You only need the `armachecafe` monorepo for:

1. **Running the real API** locally (or use prod `https://api.armachecafe.com`).
2. **Pulumi outputs** — bucket/distribution/pool/client IDs (section 6, table in
   section 3). The canonical refresh list is `docs/repo-split-runbook.md` there.
3. **Publishing `@armachecafe/openapi-client`** and the `s3://armache-contracts`
   specs the `sync:contract` step downloads.
4. **GitHub Secrets** for any future CD workflow (`STOREFRONT_BUCKET_NAME`,
   `STOREFRONT_DISTRIBUTION_ID`, Cognito IDs) — same runbook.

## 9. Troubleshooting

| Symptom | Cause → fix |
|---|---|
| `pnpm install` → 401/403 on `npm.pkg.github.com` | `GITHUB_TOKEN` missing/expired → section 2.1 |
| `sync:contract` → S3 download fails / `ExpiredToken` | AWS SSO token expired → `source scripts/aws-login.sh` |
| `deploy.sh` → "must be set" | `STOREFRONT_BUCKET_NAME` / `STOREFRONT_DISTRIBUTION_ID` not exported |
| `deploy.sh` → "No such bucket/distribution" | Infra outputs changed → re-read Pulumi outputs (section 6) |
| `git push` → permission denied | SSH key not loaded (`ssh-add`, `ssh -T git@github.com`) — not a token issue |
| Build type errors in `src/types/api.ts` | Contract regenerated with breaking changes → adapt call sites, commit both together |
| `aws` → "Unable to locate credentials" | New terminal without SSO → `source scripts/aws-login.sh` |
