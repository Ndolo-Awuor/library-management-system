# Library Management System — API

The NestJS backend for the Week 1 library management assignment. This component defines the PostgreSQL schema, seeds sample genres and books, and provides Prisma integration plus a starter greeting endpoint.

For the assignment overview, model descriptions, schema decisions, and full database setup, see the [main README](../README.md).

## Stack

NestJS 11 · TypeScript · PostgreSQL · Prisma 7 · PostgreSQL driver adapter · Jest · ESLint

The Prisma generator uses CommonJS output in `generated/prisma/`. Generated files are separate from the handwritten service in `src/prisma/`.

## Local setup

Use Node.js 24 and npm, and configure a reachable PostgreSQL database. The following commands start **inside `api`**:

```bash
npm ci
```

For a fresh setup only:

```bash
cp .env.example .env
```

Do not overwrite an existing environment file. Edit the private `.env` to set `DATABASE_URL` to your PostgreSQL connection string. URL-encode credentials when necessary and use your hosted provider's required SSL settings. Never commit credentials. For database-creation instructions, see [Getting started](../README.md#getting-started).

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
npm run start:dev
```

Confirm the database target before running migrations or the seed. The seed upserts four genres and 15 books without overwriting existing matching records; it does not create users.

The API defaults to `http://localhost:3000`. In Git Bash, set another port with:

```bash
PORT=3001 npm run start:dev
```

`PrismaService` connects during application initialization, so database connectivity is required for startup.

## Endpoint

| Method | Path | Response |
| --- | --- | --- |
| GET | `/` | `Hello World!` |

With the API running:

```bash
curl http://localhost:3000/
```

Week 1 does not expose book, genre, user, or circulation endpoints. The role enum is a database constraint, not an HTTP authorization mechanism.

## Database tooling

Run from this directory:

| Command | Purpose |
| --- | --- |
| `npx prisma generate --config prisma7.config.ts` | Generate the client from the schema |
| `npx prisma migrate deploy --config prisma7.config.ts` | Apply committed migrations to the configured database |
| `npx prisma db seed --config prisma7.config.ts` | Upsert the sample genres and books |
| `npx prisma validate --config prisma7.config.ts` | Validate the schema without applying migrations |
| `npx prisma studio --config prisma7.config.ts` | Open the database browser |

Configuration is in [prisma7.config.ts](prisma7.config.ts); models are in [schema.prisma](prisma/schema.prisma). See the [root README's sample-data notes](../README.md#sample-data) for seed behavior and placeholder ISBNs.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run start` | Compile and start the application |
| `npm run start:dev` | Start with watch mode |
| `npm run build` | Compile to `dist/` |
| `npm run start:prod` | Run the compiled application after building; still requires database configuration |
| `npm test -- --runInBand` | Run unit tests sequentially |
| `npm run test:cov -- --runInBand` | Run unit tests with coverage collection |
| `npm run test:e2e -- --runInBand` | Run the root endpoint test with application initialization and a reachable database |
| `npx eslint "{src,apps,libs,test}/**/*.ts"` | Check lint rules without modifying source |
| `npm run lint` | Run ESLint with automatic fixes; modifies source when applicable |
| `npm run format` | Rewrite TypeScript formatting in source and tests |

The tests currently cover the starter greeting, not library CRUD or database business rules. A build is not a deployment or a substitute for testing database connectivity.

## Source structure

```text
api/
├── prisma7.config.ts
├── prisma/
│   ├── schema.prisma           # User, Genre, Book, Role
│   ├── migrations/             # Initial schema migration
│   └── seed.ts                 # Repeatable genre/book sample data
├── src/
│   ├── main.ts                 # Application bootstrap and port
│   ├── app.module.ts           # Imports PrismaModule
│   ├── app.controller.ts       # GET / greeting route
│   ├── app.controller.spec.ts  # Controller unit test
│   ├── app.service.ts          # Greeting response
│   └── prisma/
│       ├── prisma.module.ts    # Provides and exports PrismaService
│       └── prisma.service.ts   # Client, adapter, and initialization connection
└── test/
    ├── app.e2e-spec.ts         # Root endpoint end-to-end test
    └── jest-e2e.json
```

## Ownership and license

Project owner: [@Ndolo-Awuor](https://github.com/Ndolo-Awuor).

The package declares `UNLICENSED`. See the [project license note](../README.md#author-and-license); framework licensing does not grant an assignment-level license.
