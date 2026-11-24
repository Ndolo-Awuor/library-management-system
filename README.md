# Library Management System — Week 3

A library catalog with a React frontend and a NestJS and PostgreSQL backend, built as a full-stack course project.

The Week 3 assignment builds on the Week 1 database foundation and Week 2 API. It adds a patron-facing catalog, book details, search, genre filtering, and the optional sorting and skeleton-loading features.

## Contents

- [Week 3 deliverables](#week-3-deliverables)
- [Week 2 backend features](#week-2-backend-features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Database models](#database-models)
- [Schema decisions](#schema-decisions)
- [Getting started](#getting-started)
- [Sample data](#sample-data)
- [Available endpoints](#available-endpoints)
- [Build and tests](#build-and-tests)
- [Project structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Current scope](#current-scope)
- [Author and license](#author-and-license)

## Week 3 deliverables

- **Responsive catalog:** A grid of book cards fetched from the library API.
- **Book details:** A detail page at `/books/:id` with the book's description, genre, ISBN, and availability.
- **Search and filtering:** Search by title or author with a 400 ms debounce, and filter by genre.
- **Request states:** Loading, error, and empty messages for the catalog; the detail page also handles missing books.
- **Optional features:** Sort matching books by title or author, and show skeleton cards while the catalog loads.

## Week 2 backend features

- **Catalog CRUD:** Create, list, retrieve, update, and delete books and genres. Catalog changes require a librarian account.
- **Catalog queries:** Filter books by genre, search by title or author, and use page-based pagination.
- **Input validation:** DTOs validate book and genre requests; the global validation pipe rejects unexpected fields.
- **Authentication:** Registration and login issue JWTs; passwords are hashed with bcrypt before storage.
- **Authorization:** JWT and role guards protect librarian-only routes. Public registration creates patron accounts.
- **Optional features:** An authenticated `GET /users/profile` endpoint and a login limit of five requests per minute per client.
- **Postman collection:** Requests are included in [docs/postman_collection.json](docs/postman_collection.json).

## Tech stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, JavaScript, React Router, Axios, CSS |
| Backend | NestJS 11, TypeScript, Node.js, Express adapter |
| Database | PostgreSQL, Prisma 7, `@prisma/adapter-pg`, `pg` |
| Authentication and validation | Passport JWT, NestJS JWT, bcrypt, class-validator, class-transformer |
| Development tooling | Nest CLI, Jest, Supertest, ESLint, Prettier, Postman |

Dependency ranges and scripts are defined in [api/package.json](api/package.json) and [client/package.json](client/package.json); each folder has its own package lock file.

## Architecture

```text
React frontend (client/)
  └── Axios HTTP request → NestJS controller → service → PrismaService → PostgreSQL
        ├── Books and genres: catalog queries and changes
        ├── Auth: registration, login, JWT and role guards
        └── Users: authenticated profile

Prisma seed script → upsert genres and books
```

DTOs validate incoming values, while JWT and role guards check access before protected handlers run. The Prisma client is generated into `api/generated/prisma/`.

## Database models

The schema is defined in [schema.prisma](api/prisma/schema.prisma).

| Model | Main fields and constraints |
| --- | --- |
| `User` | Integer `id`, unique `email`, hashed `password`, and `role` defaulting to `PATRON` |
| `Genre` | Integer `id`, unique `name`, unique `slug`, and related books |
| `Book` | Integer `id`, title, author, unique ISBN, description, optional cover image, copy counts, required genre, and creation timestamp |

`totalCopies` and `availableCopies` default to 1 in the schema. The book create service sets `availableCopies` to the submitted `totalCopies`. Users are not linked to books or loans in this schema.

## Schema decisions

### Why does Book reference Genre through a foreign key?

Many books share a genre. Storing a required `genreId` reference keeps each genre's name in one row and ensures that each book references an existing genre.

### Why does User use an enum for its role?

The `Role` enum limits values to `PATRON` and `LIBRARIAN`. The generated TypeScript types and PostgreSQL enum constrain the allowed values, while the Week 2 guards enforce role-based access to protected routes.

## Getting started

### Prerequisites

- Node.js 24 and npm for the documented development workflow.
- A running PostgreSQL database, local or hosted, and credentials for the intended development database.
- Bash/Git Bash for the commands below.

### 1. Install dependencies

From the repository root:

```bash
cd api
npm ci
```

### 2. Configure the database connection

For a fresh setup only, copy the example without overwriting an existing `.env`:

```bash
cp .env.example .env
```

Set `DATABASE_URL` in the private `api/.env` file to your PostgreSQL connection string. Use your provider's required SSL settings and URL-encode special characters in credentials where needed. Add `JWT_SECRET` with a private random value of at least 32 characters. For example, generate a value with:

```bash
node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))'
```

Place the generated value after `JWT_SECRET=` in `.env`. Keep the value private and do not commit `.env`. The JWT signing and verification configuration reads this same secret.

### 3. Generate the client and apply the migration

From `api`, after checking that `DATABASE_URL` points to the intended development database:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate deploy --config prisma7.config.ts
```

The explicit configuration path selects [prisma7.config.ts](api/prisma7.config.ts).

### 4. Add sample data

```bash
npx prisma db seed --config prisma7.config.ts
```

See [Sample data](#sample-data) for what this inserts.

### 5. Start the application

```bash
npm run start:dev
```

The default address is `http://localhost:3000`; the server uses `PORT` when supplied. PostgreSQL must be reachable during application startup. For backend-specific notes, see the [API README](api/README.md).

### 6. Start the React frontend

Keep the API terminal running. In a second Git Bash terminal, from the repository root:

```bash
cd client
npm ci
```

The assignment's `client/.env` defines `VITE_API_URL=http://localhost:3000`. Adjust it if your API uses another address, and restart Vite after changing it. Vite exposes `VITE_` variables to the browser, so do not put passwords, JWT secrets, or database credentials in this file. The backend's `api/.env` must remain private.

```bash
npm run dev
```

Open the local address printed by Vite, commonly `http://localhost:5173`. See the [client README](client/README.md) for frontend details.

## Sample data

The [seed script](api/prisma/seed.ts) upserts four genres and 15 sample books. New books receive three total and available copies. Existing matching records are left unchanged; the placeholder ISBNs are demo identifiers, not verified publication ISBNs. The seed does not create users.

Public registration creates a `PATRON`. For local development, [create-librarian.ts](api/scripts/create-librarian.ts) can create a separate librarian account using the environment variables `LIBRARIAN_EMAIL` and `LIBRARIAN_PASSWORD`. It refuses to change an existing account. Use a development database and private credentials:

```bash
export LIBRARIAN_EMAIL='your-librarian@example.test'
read -r -s -p 'Practice password: ' LIBRARIAN_PASSWORD
echo
export LIBRARIAN_PASSWORD
npx tsx scripts/create-librarian.ts
unset LIBRARIAN_EMAIL LIBRARIAN_PASSWORD
```

The password must be at least 12 characters and no more than 72 UTF-8 bytes. Never commit real credentials.

## Available endpoints

| Method | Route | Access and purpose |
| --- | --- | --- |
| GET | `/` | Public starter greeting |
| GET | `/books`, `/books/:id` | Public catalog list and individual book |
| POST, PATCH, DELETE | `/books`, `/books/:id` | Librarian-only book changes |
| GET | `/genres`, `/genres/:id` | Public genre list and individual genre |
| POST, PATCH, DELETE | `/genres`, `/genres/:id` | Librarian-only genre changes |
| POST | `/auth/register`, `/auth/login` | Register a patron or log in and receive a token |
| GET | `/auth/me`, `/users/profile` | Current authenticated user's safe identity |

The catalog list accepts `genreId`, `search`, `page`, and `limit`, for example:

```bash
curl 'http://localhost:3000/books?search=hobbit&page=1&limit=2'
```

Send the token as `Authorization: Bearer <token>` for protected routes. The login route allows five requests per 60 seconds per tracked client using the default in-memory limiter. Import the [Postman collection](docs/postman_collection.json) for examples; set credentials and tokens privately rather than saving them into the shared collection.

## Build and tests

Frontend commands from `client`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run the client linter |

The frontend build completed successfully. Manual browser checks covered catalog display, book details and missing books, title and author search, the empty state, genre filtering, sorting, a narrow screen, and the error messages shown when the backend is unavailable. Loading skeletons are implemented; their appearance depends on request speed. There are no frontend automated tests in the current client configuration.

Backend commands from `api`:

| Command | Purpose |
| --- | --- |
| `npm run build` | Compile the NestJS application |
| `npm test -- --runInBand` | Run unit tests sequentially |
| `npm run test:e2e -- --runInBand` | Run the root endpoint test; requires a reachable database |
| `npx prisma validate --config prisma7.config.ts` | Validate the schema without applying migrations |

The existing automated unit test covers the starter greeting, not all Week 2 endpoints. Manual checks have covered registration and login, profile access, patron restrictions, login throttling, book CRUD, catalog search and filtering, and pagination. Additional endpoint validation can be performed with the Postman collection.

## Project structure

```text
.
├── README.md
├── docs/
│   └── postman_collection.json
├── client/
│   ├── .env                   # Public VITE_API_URL; never put secrets here
│   ├── README.md
│   ├── package.json
│   └── src/
│       ├── main.jsx           # BrowserRouter and React entry point
│       ├── App.jsx            # Catalog and detail routes
│       ├── api.js             # Axios base URL
│       ├── components/        # Search bar, book grid and book card
│       ├── pages/             # Homepage and book details
│       └── index.css          # Responsive styles and skeletons
└── api/
    ├── README.md
    ├── .env.example
    ├── prisma7.config.ts
    ├── prisma/                 # Schema, migration and seed
    ├── scripts/                # Local librarian creation
    ├── src/
    │   ├── app.module.ts       # Feature modules
    │   ├── main.ts             # Startup, validation and CORS
    │   ├── auth/               # Login, registration, JWT and role guards
    │   ├── books/              # Book routes, queries and DTOs
    │   ├── genres/             # Genre routes, service and DTOs
    │   ├── users/              # Authenticated profile
    │   ├── common/             # Shared error handling
    │   └── prisma/             # Prisma module and service
    └── test/                   # Root endpoint end-to-end test
```

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| `DATABASE_URL is required` | Configure the private `api/.env` and run commands from `api`. |
| JWT secret error at startup | Set a private `JWT_SECRET` of at least 32 characters in `api/.env`. |
| Prisma client import cannot be resolved | Run `npx prisma generate --config prisma7.config.ts` from `api`. |
| Database connection or startup fails | Check the database, credentials, network access, and provider SSL settings. |
| `401 Unauthorized` | Log in again and send a valid, unexpired bearer token. Tokens expire after one hour. |
| `403 Forbidden` | Check that the signed-in account has the librarian role for the requested catalog change. |
| `429 Too Many Requests` on login | Wait for the login rate-limit period to pass before retrying. |
| Port 3000 is occupied | Stop the other process or run `PORT=3001 npm run start:dev` in Git Bash. |
| Frontend cannot load books or genres | Check that the API is running and `client/.env` points to its address; restart Vite after changing the file. |

## Current scope

This submission covers the Week 3 catalog frontend and the Week 2 backend, including their optional features. Borrowing and return workflows are not yet implemented. Book inventory counts cannot be modified through the generic book update DTO. The client loads all matching result pages before sorting them in the browser, which suits the course catalog but is less suitable for a large catalog or data changing during the requests. The backend's in-memory rate limit is intended for this learning setup and does not coordinate across multiple server instances.

## Author and license

Project owner: [@Ndolo-Awuor](https://github.com/Ndolo-Awuor).

No repository-level license file is included. The API package declares `UNLICENSED`; the NestJS framework's own license does not automatically license this assignment.
