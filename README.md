# AssetNexus

A modern monorepo asset management portal built with Nuxt 3, Drizzle ORM, and pnpm.

## Tech Stack

- **Frontend**: [Nuxt 3](https://nuxt.com/)
- **Styling**: [UnoCSS](https://unocss.dev/)
- **Database**: [SQLite](https://www.sqlite.org/) via [Drizzle ORM](https://orm.drizzle.team/) & [LibSQL](https://github.com/tursodatabase/libsql)
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Monorepo Tooling**: [Turborepo](https://turbo.build/)

## Getting Started

### Prerequisites

- Node.js (v22+)
- pnpm

### Installation

```bash
pnpm install
```

### Database Setup

```bash
# Push schema to database
pnpm --filter @platform/db db:push

# Seed database
pnpm --filter @platform/db db:seed

# Open Drizzle Studio
pnpm db:studio
```

### Development

```bash
pnpm dev
```

## Docker

Build the Docker image:

```bash
docker build -t asset-nexus .
```

Run the container:

```bash
docker run -p 3000:3000 asset-nexus
```

## GitHub Repository Creation

To create a new GitHub repository and push this code:

```bash
gh repo create asset-nexus --public --source=. --remote=origin --push
```
