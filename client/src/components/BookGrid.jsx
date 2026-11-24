import { useEffect, useState } from "react";

import { api } from "../api";
import BookCard from "./BookCard";

export default function BookGrid({ search, genreId, sortBy }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadBooks() {
      setLoading(true);
      setError("");

      try {
        const allBooks = [];
        const limit = 100;
        let page = 1;
        let pageBooks;

        do {
          const params = {
            page,
            limit,
          };

          if (search.trim()) {
            params.search = search.trim();
          }

          if (genreId) {
            params.genreId = genreId;
          }

          const response = await api.get("/books", {
            params,
            signal: controller.signal,
          });

          if (!Array.isArray(response.data)) {
            throw new Error("The API did not return a list of books.");
          }

          pageBooks = response.data;
          allBooks.push(...pageBooks);
          page += 1;
        } while (pageBooks.length === limit);

        if (!controller.signal.aborted) {
          setBooks(allBooks);
        }
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load books. Check that the backend is running.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadBooks();

    return () => controller.abort();
  }, [search, genreId]);

  if (loading) {
    return (
      <section aria-label="Book results">
        <p role="status">Loading books...</p>

        <div className="book-grid" aria-hidden="true">
          {[1, 2, 3, 4].map((number) => (
            <div className="book-card skeleton" key={number}>
              <span className="skeleton-line" />
              <span className="skeleton-line short" />
              <span className="skeleton-line" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  if (books.length === 0) {
    return <p>No books found.</p>;
  }

  const sortedBooks = [...books].sort((firstBook, secondBook) => {
    return firstBook[sortBy].localeCompare(secondBook[sortBy], undefined, {
      sensitivity: "base",
    });
  });

  return (
    <section>
      <h2>Available Books</h2>

      <div className="book-grid">
        {sortedBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </section>
  );
}
