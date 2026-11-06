# Library Management System

## Schema Decisions

Why Book references Genre through a foreign key instead of embedding it:
Book references Genre through a genreId foreign key because many books share one genre. Each genre’s name is stored once, so renaming it means changing one row, not every book.

Why User has a role field using an enum:
User’s role uses an enum so that only PATRON and LIBRARIAN are allowed. Both TypeScript and PostgreSQL reject any other value, which prevents typos and invented roles.
