import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../api";

export default function BookDetail() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");
    setBook(null);

    api
      .get(`/books/${encodeURIComponent(id)}`, {
        signal: controller.signal,
      })
      .then((response) => {
        if (!controller.signal.aborted) {
          setBook(response.data);
        }
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          if (requestError.response?.status === 404) {
            setError("Book not found.");
          } else {
            setError("Could not load this book. Please try again.");
          }
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  return (
    <main className="container">
      <Link to="/">← Back to catalog</Link>

      {loading && <p role="status">Loading book...</p>}

      {!loading && error && <p role="alert">{error}</p>}

      {!loading && !error && book && (
        <article>
          <h1>{book.title}</h1>

          <p>By {book.author}</p>

          {book.coverImage && (
            <img
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              width="200"
            />
          )}

          <p>{book.description || "No description available."}</p>

          <p>Genre: {book.genre?.name || "Uncategorised"}</p>

          <p>ISBN: {book.isbn}</p>

          <p>
            Available copies: {book.availableCopies} of {book.totalCopies}
          </p>
        </article>
      )}
    </main>
  );
}
