import { useEffect, useRef, useState } from "react";
import {
  createSession,
  ensureCsrf,
  logoutSession,
  searchGames,
} from "../../api";
import { Link, useNavigate } from "react-router";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase";
import Button from "../../ui/Button";
import { useAuth } from "../../context/AuthProvider";
import { IconHome } from "@tabler/icons-react";

function Header() {
  const { user, loading, login, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [games, setGames] = useState([]);
  const controllerRef = useRef(null);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  //close dropdown menu when clicking outside the login container
  useEffect(() => {
    function onDocClick(e) {
      if (!menuRef.current) return;
      //if its click outside the menu, close it
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  //close search results or dropdown when clicking outside the input
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        //clears the search results when clicking outside
        setGames([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //debounce search input
  useEffect(() => {
    const query = search.trim();
    // if query input is less than 5 characters, do not search
    if (query.length < 5) {
      //clear results if query is less than 5 characters
      setGames([]);
      controllerRef.current?.abort();
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    const timer = setTimeout(() => {
      (async () => {
        try {
          const results = await searchGames(query, {
            signal: controller.signal,
          });
          setGames(results);
        } catch (err) {
          // ignora cancelaciones; limpia en otros errores
          if (err?.name !== "AbortError") setGames([]);
        }
      })();
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (game) => {
    navigate(`/game/${game.id}`, {
      state: { name: game.name, cover_url: game.cover_url },
    });
    setGames([]);
  };

  return (
    <div className="flex items-center justify-between w-full px-8 py-4 bg-gray-800">
      <div className="relative">
        <Link to="/">
          <IconHome size={25} color="white" />
        </Link>
      </div>
      <div className="flex-1 flex justify-center">
        <div ref={wrapperRef} className="relative w-full max-w-md">
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
          {games.length > 0 && (
            <ul className="absolute z-10 bg-gray-800 w-full mt-2 rounded shadow-lg max-h-48 overflow-y-auto">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="h-16 p-2 text-white hover:bg-gray-700
                  cursor-pointer flex items-center gap-3"
                >
                  <Link
                    to={`/game/${game.id}`}
                    state={{ name: game.name, cover_url: game.cover_url }}
                    onClick={() => setGames([])} // closes the dropdown
                    className="flex items-center gap-3 h-16 p-2 text-white hover:bg-gray-700 w-full"
                  >
                    {game.cover_url && (
                      <img
                        src={game.cover_url}
                        alt={game.name}
                        className="w-10 h-14 object-cover rounded"
                        loading="lazy"
                      />
                    )}
                    <span>{game.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="relative" ref={menuRef}>
        {user ? (
          <>
            <Button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={user.name || user.email}
            >
              <img
                src={user.picture}
                alt="avatar"
                className="w-8 h-8 rounded-full inline-block"
                title={user.email}
              />
            </Button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded shadow-md py-1 z-20">
                <Button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={logout}
                >
                  Logout
                </Button>
              </div>
            )}
          </>
        ) : (
          <Button
            onClick={login}
            loading={loading}
            className="text-white font-bold"
          >
            Log in
          </Button>
        )}
      </div>
    </div>
  );
}

export default Header;
