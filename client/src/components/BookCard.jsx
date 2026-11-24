import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <article className="book-card">
      <h2>
        <Link to={`/books/${book.id}`}>{book.title}</Link>
      </h2>

      <p>By {book.author}</p>

      <p>Genre: {book.genre?.name || "Uncategorised"}</p>

      <p>Available copies: {book.availableCopies}</p>
    </article>
  );
}
