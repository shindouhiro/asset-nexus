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

# Production image
FROM node:22-slim AS runner

WORKDIR /app

# Copy the built output from Nuxt
COPY --from=build /app/apps/web/.output ./.output

# Copy the database package for runtime (if needed for the SQLite file or shared logic)
# Note: Nuxt usually bundles dependencies, but let's ensure the DB file location is consistent
COPY --from=build /app/packages/db/sqlite.db ./packages/db/sqlite.db

# Expose the port (Nuxt defaults to 3000)
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
