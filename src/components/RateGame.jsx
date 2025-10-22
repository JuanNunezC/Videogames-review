import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { GetGameById } from "../api";
import StarRating from "../ui/StarRating";

function RateGame() {
  const { id } = useParams();
  const { state } = useLocation() || {};
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

  return (
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
          <StarRating rating={userRating} onChange={setUserRating} size={40} />
        </div>
      </div>
    </div>
  );
}

export default RateGame;
