import {
  IconStar,
  IconStarFilled,
  IconStarHalfFilled,
} from "@tabler/icons-react";
import { useState } from "react";

function StarRating({ rating = 0, onChange, size = 24 }) {
  const [hover, setHover] = useState(null);
  const [animateIndex, setAnimateIndex] = useState(null);
  // show hover value if exists, otherwise show rating, when clicked it stores the value of the Star
  const displayRating = hover ?? rating;
  const Zero_Rating = 0.18;

  const HalfOrFull = (i, clientX, el) => {
    const rect = el.getBoundingClientRect();
    const rel = (clientX - rect.left) / rect.width;
    if (i === 0 && rel < Zero_Rating) return 0;
    return i + (rel < 0.5 ? 0.5 : 1);
  };

  const handleMouseMove = (i) => (e) => {
    setHover(HalfOrFull(i, e.clientX, e.currentTarget));
  };

  const handleTouch = (i) => (e) => {
    const t = e.touches?.[0];
    if (!t) return;
    setHover(HalfOrFull(i, t.clientX, e.currentTarget));
  };

  const handleClick = (i) => (e) => {
    if (!onChange) return;
    onChange(HalfOrFull(i, e.clientX, e.currentTarget));
    setAnimateIndex(i);
  };

  return (
    <div
      className={`flex gap-1 select-none`}
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
