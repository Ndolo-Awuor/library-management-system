import { useEffect, useState } from "react";

import { api } from "../api";
import SearchBar from "../components/SearchBar";
import BookGrid from "../components/BookGrid";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [sortBy, setSortBy] = useState("title");

  const [genres, setGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(true);
  const [genresError, setGenresError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    api
      .get("/genres", {
        signal: controller.signal,
      })
      .then((response) => {
        if (!Array.isArray(response.data)) {
          throw new Error("The API did not return a list of genres.");
        }

        if (!controller.signal.aborted) {
          setGenres(response.data);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setGenresError("Could not load genres. Please refresh the page.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setGenresLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <main className="container">
      <h1>Library Catalog</h1>

      <p>Find your next book.</p>

      <SearchBar onSearch={setSearch} />

      <label>
        Genre
        <select
          value={genreId}
          onChange={(event) => setGenreId(event.target.value)}
          disabled={genresLoading || Boolean(genresError)}
        >
          <option value="">
            {genresLoading ? "Loading genres..." : "All genres"}
          </option>

          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </label>

      {genresError && <p role="alert">{genresError}</p>}

      <label>
        Sort by
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </label>

      <BookGrid search={search} genreId={genreId} sortBy={sortBy} />
    </main>
  );
}
