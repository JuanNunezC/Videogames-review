import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { useState } from "react";

function StarRating({ rating = 0, onChange, size = 24 }) {
  const [hover, setHover] = useState(null);
  const [animateIndex, setAnimateIndex] = useState(null);
  // show hover value if exists, otherwise show rating, when clicked it stores the value of the Star on rating
  const displayRating = hover ?? rating;
  //this enables us to give a zero rating by clicking very left on the first star
  const Zero_Rating = 0.18;

  const HalfOrFull = (i, clientX, el) => {
    const rect = el.getBoundingClientRect();
    const rel = (clientX - rect.left) / rect.width;
    //if it's the first star and the click is within the zero zone, return 0
    if (i === 0 && rel < Zero_Rating) return 0;
    //otherwise, return half or full star
    return i + (rel < 0.5 ? 0.5 : 1);
  };

  // calculate if half or full star based on hover mouse position
  const handleMouseMove = (i) => (e) => {
    setHover(HalfOrFull(i, e.clientX, e.currentTarget));
  };

  // calculate if half or full star based on touch position(mobile)
  const handleTouch = (i) => (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    setHover(HalfOrFull(i, t.clientX, e.currentTarget));
  };

  const handleClick = (i) => (e) => {
    if (!onChange) return;
    // calculate if half or full star based on click position and passes it to RateGame
    // ex. if click is on the left half of the star, it's a half star(0.5)
    // ex. if click is on the right half of the star, it's a full star(1)
    onChange(HalfOrFull(i, e.clientX, e.currentTarget));
    // stores the index of the star being clicked to trigger animation on app.css
    setAnimateIndex(i);
  };

  return (
    <div
      className={`flex gap-1 select-none`}
      // Clears hover state when mouse leaves the component(stars) to its initial state
      onMouseLeave={() => setHover(null)}
      role={onChange ? "slider" : undefined}
      aria-valuemin={onChange ? 0 : undefined}
      aria-valuemax={onChange ? 5 : undefined}
      aria-valuenow={onChange ? displayRating : undefined}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const starValue = displayRating - i;
        const active = starValue >= 1;
        const half = !active && starValue >= 0.5;
        const isAnimating = animateIndex === i;

        const color = active || half ? "text-yellow-400" : "text-gray-300";
        return (
          <span
            key={i}
            className={`cursor-pointer ${color} transition-[transform,color] duration-150 ease-out origin-center will-change-transform ${
              isAnimating ? "star-pop" : ""
            }`}
            onMouseMove={handleMouseMove(i)}
            onClick={handleClick(i)}
            onTouchStart={handleTouch(i)}
            onTouchMove={handleTouch(i)}
            onAnimationEnd={() => setAnimateIndex(null)} // limpia al terminar
          >
            {active ? (
              <IconStarFilled size={size} stroke={1.5} />
            ) : half ? (
              <IconStarHalfFilled size={size} stroke={1.5} />
            ) : (
              <IconStar size={size} stroke={1.5} />
            )}
          </span>
        );
      })}
    </div>
  );
}

export default StarRating;
