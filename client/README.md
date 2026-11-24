# Library Management System — Client

The React frontend for the Week 3 library management assignment. It displays a book catalog and detail pages using the Week 2 NestJS API.

For the project overview, database setup, and backend instructions, see the [main README](../README.md).

## Stack

React · Vite · JavaScript · React Router · Axios · CSS

## Local setup

Start the backend first, following the [main README](../README.md#getting-started). It normally listens on `http://localhost:3000`.

In a second Git Bash terminal, from this `client` folder:

```bash
npm ci
npm run dev
```

Open the local address shown by Vite, commonly `http://localhost:5173`.

`client/.env` sets `VITE_API_URL=http://localhost:3000` for the assignment. If the backend address changes, update that file and restart Vite. `VITE_` values are exposed to browser code, so this file must not contain secrets. Database credentials and the JWT secret belong in the backend's private `api/.env`.

## Pages and features

| Page | Path | Description |
| --- | --- | --- |
| Catalog | `/` | Responsive book cards, title or author search, genre filter, and sort selector |
| Book details | `/books/:id` | Title, author, description, genre, ISBN, cover when available, and copy counts |

The search waits for a 400 ms pause in typing. The catalog shows skeleton cards while loading, an error message if the request fails, and an empty message when no books match. The detail page also reports a missing book.

The client requests pages of matching books and sorts the combined results in the browser. This is appropriate for a small teaching catalog; server-side sorting and pagination would scale better for a large or frequently changing catalog.

## API connection

Axios is configured in [src/api.js](src/api.js). The catalog uses `GET /books` with search, genre, and pagination parameters; the genre selector uses `GET /genres`; and the detail page uses `GET /books/:id`. These read endpoints are public in the Week 2 API.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run Oxlint |
| `npm run preview` | Preview an existing production build locally |

The frontend build and browser behavior were manually checked. This client does not currently define an automated test script.

## Source structure

```text
client/
├── .env                       # Public API URL, no secrets
├── package.json
└── src/
    ├── main.jsx               # React entry point and BrowserRouter
    ├── App.jsx                # Catalog and book detail routes
    ├── api.js                 # Axios base URL
    ├── components/
    │   ├── BookCard.jsx       # One book card
    │   ├── BookGrid.jsx       # Catalog requests, states and sorting
    │   └── SearchBar.jsx      # Debounced input
    ├── pages/
    │   ├── HomePage.jsx       # Shared filter and sort state
    │   └── BookDetail.jsx     # Book details by route ID
    └── index.css              # Responsive layout and skeleton styling
```

## Ownership and license

Project owner: [@Ndolo-Awuor](https://github.com/Ndolo-Awuor). See the [main README](../README.md#author-and-license) for the repository's license note.
