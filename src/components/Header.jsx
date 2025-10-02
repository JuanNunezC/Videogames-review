import { useState } from "react";
import { searchGames } from "../api";

function Header() {
  const [search, setSearch] = useState("");
  const [games, setGames] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length > 5) {
      try {
        const results = await searchGames(value);
        setGames(results);
      } catch (error) {
        setGames([]);
      }
    } else {
      setGames([]);
    }
  };

  return (
    <div className="flex items-center justify-between w-full px-8 py-4 bg-gray-800">
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Searchbar..."
            maxLength={60}
            className="bg-gray-700 text-white pl-10 px-4 py-4 placeholder-gray-400 w-full rounded-full"
          />
        </div>
      </div>
      <div className="ml-8 text-white font-semibold cursor-pointer">Log in</div>
    </div>
  );
}

export default Header;
