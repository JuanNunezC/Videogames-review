import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { GetGameById } from "../../api";
import StarRating from "../../ui/StarRating";
import Button from "../../ui/Button";
import { useAuth } from "../../context/AuthProvider";
import { getUserReview, submitReview } from "../../api/reviews";

function RateGame() {
  const { id } = useParams();
  const { state } = useLocation() || {};
  const { user } = useAuth();
  const [name, setName] = useState(state?.name || "");
  const [cover, setCover] = useState(state?.cover_url || "");
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    if (state?.name) {
      // if obtained through header, use it directly without fetching from api
      setName(state.name);
      setCover(state.cover_url || "");
    } else {
      (async () => {
        try {
          const data = await GetGameById(id, { signal: controller.signal });
          setName(data.name);
          setCover(data.cover_url || "");
        } catch (error) {
          if (error.name !== "AbortError") {
            setName("Game not found");
            setCover("");
          }
        }
      })();
    }
    return () => controller.abort();
    // it executes if id from the URL or the state changes
  }, [id, state]);

  // reset user stars rating when game changes
  useEffect(() => {
    setUserRating(0);
    if (!id || !user?.uid) return;
    let alive = true;
    (async () => {
      try {
        const review = await getUserReview(id, user.uid);
        if (alive) setUserRating(review?.star_rating ?? 0);
      } catch {
        if (alive) setUserRating(0);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, user?.uid]);

  // submit user review to database
  const handleSubmit = async () => {
    if (!user || userRating === 0) return;
    try {
      await submitReview({
        gameId: id,
        gameName: name,
        rating: userRating,
        user,
      });
      console.log("Review guardada/actualizada");
    } catch (e) {
      console.error("Error al guardar review:", e); // Verás PERMISSION_DENIED si reglas/UID no coinciden
    }
  };

  return (
    <>
      <div className="flex-1 flex items-center justify-center w-full h-full bg-gray-400 px-8 py-4">
        <div className=" text-white -translate-y-15">
          <h1 className="text-3xl font-bold mb-4 text-center">{name}</h1>
          {cover && (
            <img
              src={cover}
              alt={name}
              className="w-32 h-44 sm:w-40 sm:h-56 lg:w-48 lg:h-72 object-cover rounded mb-4 block mx-auto"
            />
          )}
          <div className="flex justify-center items-center">
            <StarRating
              key={id}
              rating={userRating}
              onChange={setUserRating}
              size={40}
            />
          </div>
          <div className="flex justify-center items-center mt-5">
            <Button
              className="text-white"
              disabled={!user || userRating === 0}
              onClick={handleSubmit}
            >
              {user ? "Submit Review" : "Login to rate game"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default RateGame;
