# Build a partir da raiz do monorepo:
#   docker build -f apps/home/Dockerfile .
FROM node:22-alpine AS base

# ── Dependências do monorepo ────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json turbo.json ./
COPY apps/home/package.json ./apps/home/
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
RUN npm ci --ignore-scripts

# ── Build da zona home ──────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# URL da zona dashboard, resolvida em build (rewrites do multi-zone)
ARG DASHBOARD_URL=http://dashboard:3001
ENV DASHBOARD_URL=$DASHBOARD_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build:home

# ── Runtime mínimo (output standalone) ──────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone output - this includes apps/home/server.js
COPY --from=builder --chown=nextjs:nodejs /app/apps/home/.next/standalone ./
# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/apps/home/.next/static ./apps/home/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/home/public ./apps/home/public

USER nextjs
EXPOSE 3333
ENV PORT=3333
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/home/server.js"]
