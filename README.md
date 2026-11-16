# Library Management System — Week 1

A NestJS and PostgreSQL foundation for a library application, with a relational Prisma schema, an initial migration, and repeatable sample data.

This Week 1 assignment focuses on database modeling and connecting Prisma to NestJS. It defines users, genres, and books; later application features are outside this submission's current scope.

## Contents

- [Week 1 deliverables](#week-1-deliverables)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Database models](#database-models)
- [Schema decisions](#schema-decisions)
- [Getting started](#getting-started)
- [Sample data](#sample-data)
- [Available endpoint](#available-endpoint)
- [Build and tests](#build-and-tests)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Current scope](#current-scope)
- [Author and license](#author-and-license)

## Week 1 deliverables

- **Relational schema:** `User`, `Genre`, and `Book` models with identifiers, required fields, defaults, and uniqueness constraints.
- **Role enum:** `PATRON` and `LIBRARIAN` values, with `PATRON` as the default.
- **Genre relationship:** Each book belongs to one genre; a genre can contain many books.
- **Initial migration:** A committed SQL migration for creating the PostgreSQL schema.
- **Repeatable seed:** Four genres and 15 sample books, inserted with upserts.
- **NestJS integration:** A `PrismaService` supplied through `PrismaModule` and connected during module initialization.
- **Starter endpoint:** `GET /` returns `Hello World!`.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Backend | NestJS 11, TypeScript, Node.js, Express adapter |
| Database | PostgreSQL, Prisma 7, `@prisma/adapter-pg`, `pg` |
| Configuration and seeding | dotenv, Prisma configuration, tsx |
| Development tooling | Nest CLI, Jest, Supertest, ESLint, Prettier |

Dependency ranges and scripts are defined in [api/package.json](api/package.json); [api/package-lock.json](api/package-lock.json) records the locked dependency tree.

## Architecture

```text
NestJS application (api/)
  ├── AppController → AppService → GET / greeting
  └── PrismaModule → PrismaService
        └── Prisma client + PostgreSQL driver adapter
              └── PostgreSQL
                    ├── User
                    └── Genre (one) → Book (many)

Prisma seed script → upsert genres and books
```

The application reads `DATABASE_URL` from its environment. The Prisma client is generated into `api/generated/prisma/`, with CommonJS output configured in the schema.

## Database models

The source of truth is [schema.prisma](api/prisma/schema.prisma).

| Model | Main fields and constraints |
| --- | --- |
| `User` | Auto-incrementing integer `id`, unique `email`, required `password`, and `role` defaulting to `PATRON` |
| `Genre` | Auto-incrementing integer `id`, unique `name`, unique `slug`, and a collection of related books |
| `Book` | Auto-incrementing integer `id`, title, author, unique ISBN, description, optional cover image, copy counts, required genre, and creation timestamp |

`totalCopies` and `availableCopies` each default to 1. `createdAt` defaults to the insertion time. Users are not linked to books or loans in this schema.

## Schema decisions

### Why does Book reference Genre through a foreign key?

Many books share a genre. Storing a required `genreId` reference keeps each genre's name in one row, so renaming a genre does not require updating every book. The relation also ensures that a book references an existing genre.

### Why does User use an enum for its role?

The `Role` enum limits values to `PATRON` and `LIBRARIAN`. The generated TypeScript types and PostgreSQL enum constrain the allowed values, helping prevent typos and invented roles. This models a user's role; it does **not** implement authentication or enforce permissions on HTTP routes.

## Getting started

### Prerequisites

- Node.js 24 and npm for the documented development workflow.
- A running PostgreSQL database, local or hosted.
- Database credentials with permission to apply the committed migration.
- Bash/Git Bash for the commands below.

### 1. Install dependencies

From the repository root:

```bash
cd api
npm ci
```

### 2. Configure the database connection

For a fresh setup only:

```bash
cp .env.example .env
```

Do not overwrite an existing `.env`. Edit `DATABASE_URL` to match your PostgreSQL connection. For example, a local development connection has this shape:

```dotenv
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/library_db?schema=public"
```

Use your actual credentials only in the private environment file, and URL-encode special characters. For a hosted database, use the provider's connection string and required SSL settings. Never commit `.env` or credentials.

For local PostgreSQL, create the database first if it does not exist. With `psql` on your `PATH`:

```bash
psql -h localhost -U postgres -d postgres -c "CREATE DATABASE library_db;"
```

Substitute your PostgreSQL role and database name as needed.

### 3. Generate the client and apply the migration

From `api`:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
```

The explicit config path selects [prisma7.config.ts](api/prisma7.config.ts), which defines the schema path, migration directory, seed command, and database URL. Check the database target before applying migrations.

### 4. Add sample data

```bash
npx prisma db seed --config prisma7.config.ts
```

See [Sample data](#sample-data) for what this inserts.

### 5. Start the application

```bash
npm run start:dev
```

The default address is `http://localhost:3000`; the server uses `PORT` when supplied. The application connects to PostgreSQL during module initialization, so valid database configuration is required to start it.

For backend-specific commands, see the [API README](api/README.md).

## Sample data

The [seed script](api/prisma/seed.ts) defines:

- **Four genres:** Fantasy, Science Fiction, Mystery, and Biography.
- **15 books:** Including *The Hobbit*, *Dune*, *Binti*, *Nairobi Heat*, and *Unbowed*.
- **Three total and available copies** for each newly inserted sample book.

Genres are upserted by slug and books by stable, made-up placeholder ISBNs. Existing matching records are left unchanged, so rerunning the seed does not duplicate them or reset their copy counts. These ISBNs are demo identifiers, not verified publication ISBNs. The seed does not create users.

To inspect records visually, run this from `api`:

```bash
npx prisma studio --config prisma7.config.ts
```

## Available endpoint

| Method | Route | Response |
| --- | --- | --- |
| GET | `/` | Plain text: `Hello World!` |

Once the application is running:

```bash
curl http://localhost:3000/
```

This is a starter greeting endpoint, not a catalog or circulation API. There are no book, genre, user-management, or loan routes in the Week 1 submission.

## Build and tests

Run these commands from `api`:

| Command | Purpose |
| --- | --- |
| `npm run build` | Compile the NestJS application into `dist/` |
| `npm test -- --runInBand` | Run unit tests sequentially |
| `npm run test:cov -- --runInBand` | Run unit tests with coverage collection |
| `npm run test:e2e -- --runInBand` | Run the root endpoint test; requires a configured, reachable database |
| `npx prisma validate --config prisma7.config.ts` | Validate the schema without applying migrations |
| `npx eslint "{src,apps,libs,test}/**/*.ts"` | Check lint rules without automatically modifying source |

The package's `npm run lint` script includes `--fix`, and `npm run format` rewrites source formatting. Use those deliberately rather than as read-only checks. The existing unit and end-to-end tests target the greeting endpoint, not complete database or library workflows.

## Project structure

```text
.
├── README.md
└── api/
    ├── README.md
    ├── .env.example
    ├── prisma7.config.ts
    ├── prisma/
    │   ├── schema.prisma
    │   ├── migrations/          # Initial PostgreSQL schema migration
    │   └── seed.ts              # Genre and book upserts
    ├── src/
    │   ├── app.module.ts        # Registers PrismaModule
    │   ├── app.controller.ts    # GET / route
    │   ├── app.service.ts       # Greeting response
    │   ├── main.ts              # Application startup
    │   └── prisma/
    │       ├── prisma.module.ts
    │       └── prisma.service.ts
    └── test/                   # Root endpoint end-to-end test
```

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `DATABASE_URL is required` | Create the private `api/.env`, configure the URL, and run commands from `api`. |
| Prisma client import cannot be resolved | Run `npx prisma generate --config prisma7.config.ts` from `api`. |
| Database connection or startup fails | Check that PostgreSQL is reachable, credentials are correct, the database exists, and hosted SSL settings match the provider. |
| Tables are missing | Apply the committed migration against the intended database. |
| Seed command cannot find its configuration | Run from `api` and include `--config prisma7.config.ts`. |
| Port 3000 is occupied | Stop the conflicting process or use another port, for example `PORT=3001 npm run start:dev` in Git Bash. |

## Current scope

This submission supplies the database foundation, not a complete library product. It does not include a frontend, authentication, password hashing, role-based route guards, catalog CRUD endpoints, or borrowing/return workflows. The `password` field and `Role` enum are schema definitions, not a completed account-security implementation. Do not treat the project as a production-ready service or use real user passwords in sample data.

## Author and license

Project owner: [@Ndolo-Awuor](https://github.com/Ndolo-Awuor).

No repository-level license file is included. The API package declares `UNLICENSED`; the NestJS framework's own license does not automatically license this assignment.
