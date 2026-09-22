# Armache Storefront

Next.js 14 static-export storefront for Armache Cafe.

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm dev
```

## Build

```bash
pnpm build
```

## Deploy

```bash
export STOREFRONT_BUCKET_NAME=<bucket>
export STOREFRONT_DISTRIBUTION_ID=<distribution-id>
pnpm build
bash scripts/deploy.sh
```

## Contract dependency

Types are generated from `@armachecafe/openapi-client` (published from the backend repo).
