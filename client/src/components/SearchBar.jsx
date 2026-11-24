import { useEffect, useState } from "react";

export default function SearchBar({ onSearch }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(text);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [text, onSearch]);

  return (
    <label>
      Search by title or author
      <input
        type="search"
        placeholder="Enter a title or author"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </label>
  );
}
