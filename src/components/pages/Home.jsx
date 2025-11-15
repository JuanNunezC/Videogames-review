import { useEffect, useState } from "react";
import { getAllReviews, aggregateByGame } from "../../api/reviews";
import { Link } from "react-router";
import StarRating from "../../ui/StarRating";

// Round to nearest 0.5 ex 3.24 to 3.0, 3.25 to 3.5,etc.
function roundToHalf(n) {
  return Math.round((Number(n) || 0) * 2) / 2;
}

function Home() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // On mount, fetch all reviews and sorts by average rating
  useEffect(() => {
    (async () => {
      try {
        const reviews = await getAllReviews();
        const agg = aggregateByGame(reviews).sort(
          (a, b) => b.average - a.average
        );
        setGames(agg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;

  return (
    <div className="w-full max-w-2xl mx-auto text-white">
      <h1 className="mt-25 text-2xl font-bold mb-4 text-center">
        Game Averages
      </h1>
      <div className="gap-x-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((g) => (
          <div key={g.game_id} className="min-w-0">
            <Link to={`/game/${g.game_id}`}>
              <img
                src={g.cover_url || ""}
                alt={g.game_name}
                className="w-full aspect-[2/3] object-cover rounded bg-gray-600"
              />
            </Link>

            <Link
              to={`/game/${g.game_id}`}
              className="mt-2 block text-base font-semibold truncate"
              title={g.game_name}
            >
              {g.game_name}
            </Link>

            <p className="text-xs mt-1 opacity-80">Average rating</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="pointer-events-none">
                <StarRating rating={roundToHalf(g.average)} size={18} />
              </div>
              <span className="text-sm opacity-80">
                {g.average} ({g.count})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
