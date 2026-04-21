# Use Node.js 22 as the base image
FROM node:22-slim AS base

# Install pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /app

# Copy lockfile and workspace config
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all packages and apps metadata
COPY packages/db/package.json ./packages/db/
COPY apps/web/package.json ./apps/web/

# Install dependencies
FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the application
RUN pnpm --filter web build

# Generate database schema (creates sqlite.db if it doesn't exist)
RUN pnpm --filter @platform/db db:push --force
RUN pnpm --filter @platform/db db:seed

# Production image
FROM node:22-slim AS runner

WORKDIR /app

# Install production dependencies for native modules like better-sqlite3
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/db/package.json ./packages/db/
COPY apps/web/package.json ./apps/web/

# Install pnpm and prod dependencies
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Copy the built output from Nuxt
COPY --from=build /app/apps/web/.output ./.output

# Copy the database package for runtime
COPY --from=build /app/packages/db/sqlite.db ./packages/db/sqlite.db

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
