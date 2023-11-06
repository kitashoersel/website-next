FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app


#! Install dependencies

FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json server/package.json
COPY modules/eslint-config/package.json modules/eslint-config/package.json
COPY modules/prettier-config/package.json modules/prettier-config/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


#! Build the standalone output

FROM base AS builder

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/package.json /app/pnpm-lock.yaml ./
COPY --from=deps /app/node_modules node_modules

COPY server server
COPY modules modules
RUN cd server && pnpm run build -- --no-lint


#! Start the production image

FROM base AS runner

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install pm2 -g

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/server/.next/standalone .
COPY --from=builder --chown=nextjs:nodejs /app/server/public server/public
COPY --from=builder --chown=nextjs:nodejs /app/server/.next/static server/.next/static

USER nextjs
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["pm2-runtime", "server/server.js"]
