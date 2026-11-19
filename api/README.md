# Library Management System — API

The NestJS backend for the Week 2 library management assignment. It provides book and genre endpoints, validation, registration and login, JWT and role guards, and an authenticated profile.

For the assignment overview, model descriptions, schema decisions, and full database setup, see the [main README](../README.md).

## Stack

NestJS 11 · TypeScript · PostgreSQL · Prisma 7 · Passport JWT · bcrypt · class-validator · Jest

The Prisma generator uses CommonJS output in `generated/prisma/`. Generated files are separate from the handwritten service in `src/prisma/`.

## Local setup

Use Node.js 24 and npm, and configure a reachable PostgreSQL development database. The following commands start **inside `api`**:

```bash
npm ci
```

For a fresh setup only:

```bash
cp .env.example .env
```

Do not overwrite an existing environment file. Set the private `DATABASE_URL` and a random `JWT_SECRET` of at least 32 characters in `.env`. For database and secret setup, see [Getting started](../README.md#getting-started). Never commit credentials.

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
npx prisma db seed --config prisma7.config.ts
npm run start:dev
```

Confirm the database target before running migrations or the seed. The seed upserts four genres and 15 books without overwriting existing matching records; it does not create users. The API defaults to `http://localhost:3000` and connects to PostgreSQL during startup.

## Endpoint

| Method | Path | Access and purpose |
| --- | --- | --- |
| GET | `/` | Public greeting |
| GET | `/books`, `/books/:id` | Public book list and individual book |
| POST | `/books` | Librarian creates a book |
| PATCH, DELETE | `/books/:id` | Librarian updates or deletes a book |
| GET | `/genres`, `/genres/:id` | Public genre list and individual genre |
| POST | `/genres` | Librarian creates a genre |
| PATCH, DELETE | `/genres/:id` | Librarian updates or deletes a genre |
| POST | `/auth/register`, `/auth/login` | Register a patron or log in |
| GET | `/auth/me`, `/users/profile` | Authenticated user's safe identity |

`GET /books` accepts `genreId`, `search`, `page`, and `limit`. Protected routes require `Authorization: Bearer <token>`; book and genre changes additionally require `LIBRARIAN`. Login is limited to five requests per minute per tracked client. The [Postman collection](../docs/postman_collection.json) contains request examples.

## Database tooling

Run from this directory:

| Command | Purpose |
| --- | --- |
| `npx prisma generate --config prisma7.config.ts` | Generate the client from the schema |
| `npx prisma migrate deploy --config prisma7.config.ts` | Apply committed migrations to the configured database |
| `npx prisma db seed --config prisma7.config.ts` | Upsert sample genres and books |
| `npx prisma validate --config prisma7.config.ts` | Validate the schema without applying migrations |
| `npx prisma studio --config prisma7.config.ts` | Open the database browser |

Configuration is in [prisma7.config.ts](prisma7.config.ts); models are in [schema.prisma](prisma/schema.prisma). See the [root README](../README.md#sample-data) for seed behavior and local librarian setup.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run start:dev` | Start with watch mode |
| `npm run build` | Compile the application |
| `npm test -- --runInBand` | Run unit tests sequentially |
| `npm run test:e2e -- --runInBand` | Run the root endpoint test with a reachable database |
| `npx eslint "{src,apps,libs,test}/**/*.ts"` | Check lint rules without modifying source |
| `npm run lint` | Run ESLint with automatic fixes |
| `npm run format` | Rewrite TypeScript formatting in source and tests |

The existing automated unit test covers the starter greeting, not complete catalog and authentication workflows. See [Build and tests](../README.md#build-and-tests) for the checks performed.

## Source structure

```text
api/
├── prisma7.config.ts
├── prisma/                   # Schema, migration and seed
├── scripts/                  # Local librarian creation
├── src/
│   ├── main.ts               # Startup, validation and CORS
│   ├── app.module.ts         # Registers feature modules
│   ├── auth/                 # Authentication and role guards
│   ├── books/                # Book routes, service and DTOs
│   ├── common/               # Shared exception handling
│   ├── genres/               # Genre routes, service and DTOs
│   ├── prisma/               # Prisma module and service
│   └── users/                # Authenticated profile route
└── test/                     # Root endpoint end-to-end test
```

## Ownership and license

Project owner: [@Ndolo-Awuor](https://github.com/Ndolo-Awuor).

The package declares `UNLICENSED`. See the [project license note](../README.md#author-and-license); framework licensing does not grant an assignment-level license.
