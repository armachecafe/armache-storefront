#!/usr/bin/env bash
set -euo pipefail

##
# Deploy storefront static build to S3 + invalidate CloudFront cache.
# Usage: bash scripts/deploy.sh
#
# Prerequisites:
#   - AWS credentials configured (aws configure or AWS_PROFILE)
#   - Next.js build completed (npm run build)
#   - Env vars: STOREFRONT_BUCKET_NAME, STOREFRONT_DISTRIBUTION_ID
##

BUCKET="${STOREFRONT_BUCKET_NAME:-}"
DISTRIBUTION_ID="${STOREFRONT_DISTRIBUTION_ID:-}"
DIST_DIR="./out"

if [ -z "$BUCKET" ] || [ -z "$DISTRIBUTION_ID" ]; then
  echo "❌ STOREFRONT_BUCKET_NAME and STOREFRONT_DISTRIBUTION_ID must be set"
  exit 1
fi

if [ ! -d "$DIST_DIR" ]; then
  echo "❌ Build directory not found: $DIST_DIR"
  echo "   Run: npm run build"
  exit 1
fi

# 1. Content-hashed immutable assets: sync WITHOUT --delete
echo "📦 Syncing immutable assets → s3://$BUCKET/_next/static/"
aws s3 sync "$DIST_DIR/_next/static" "s3://$BUCKET/_next/static" \
  --cache-control "public, max-age=31536000, immutable"

# 2. Everything else: short cache + --delete
echo "📦 Syncing HTML + top-level files → s3://$BUCKET/"
aws s3 sync "$DIST_DIR" "s3://$BUCKET/" \
  --delete \
  --exclude "_next/static/*" \
  --cache-control "public, max-age=0, must-revalidate"

# 3. CloudFront invalidation
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text

echo "✅ Storefront deployed"
