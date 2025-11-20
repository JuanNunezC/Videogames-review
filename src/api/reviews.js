import { db } from "../firebase";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

function makeReviewId(gameId, uid) {
  return `${String(gameId)}_${uid}`;
}

export async function submitReview({
  gameId,
  gameName,
  rating,
  user,
  coverUrl,
}) {
  if (!user || !user.uid) throw new Error("Usuario sin uid");

  const reviewId = makeReviewId(gameId, user.uid);

  await setDoc(
    doc(db, "reviews", reviewId),
    {
      game_id: String(gameId),
      game_name: gameName,
      cover_url: coverUrl || "",
      star_rating: rating,
      user_uid: user.uid,
      user_name: user.name || "",
      user_email: user.email || "",
      updated_at: new Date().toISOString(),
    },
    { merge: true }
  );
}

export async function getUserReview(gameId, userId) {
  const snap = await getDoc(doc(db, "reviews", `${gameId}_${userId}`));
  return snap.exists() ? snap.data() : null;
}

export async function getAllReviews() {
  const snap = await getDocs(collection(db, "reviews"));
  return snap.docs.map((doc) => doc.data());
}

export function aggregateByGame(reviews) {
  const map = new Map();
  for (const review of reviews) {
    const id = review.game_id;
    const entry = map.get(id);
    if (!entry) {
      map.set(id, {
        game_id: id,
        game_name: review.game_name,
        cover_url: review.cover_url || "",
        sum: review.star_rating,
        count: 1,
      });
    } else {
      entry.sum += review.star_rating;
      entry.count += 1;
    }
  }
  return Array.from(map.values()).map((g) => ({
    game_id: g.game_id,
    game_name: g.game_name,
    cover_url: g.cover_url,
    average: Number((g.sum / g.count).toFixed(2)),
    count: g.count,
  }));
}

// Order Reviews from A-Z
export async function getReviewsByNameAsc(db) {
  const query = query(collection(db, "reviews"), orderBy("game_name", "asc"));
  const res = await getDocs(query);
  return res.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Order reviews from Z-A
export async function getReviewsByNameDesc(db) {
  const q = query(collection(db, "reviews"), orderBy("game_name", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Ordenar reviews from high to low rating
export async function getReviewsByRatingAsc(db) {
  const q = query(collection(db, "reviews"), orderBy("star_rating", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Ordenar reviews from low to high rating
export async function getReviewsByRatingDesc(db) {
  const query = query(
    collection(db, "reviews"),
    orderBy("star_rating", "desc")
  );
  const res = await getDocs(query);
  return res.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getReviewsSorted(db, mode) {
  let field, dir;
  switch (mode) {
    case "name_asc":
      field = "game_name";
      dir = "asc";
      break;
    case "name_desc":
      field = "game_name";
      dir = "desc";
      break;
    case "rating_asc":
      field = "star_rating";
      dir = "asc";
      break;
    default:
      field = "star_rating";
      dir = "desc";
  }
  const q = query(collection(db, "reviews"), orderBy(field, dir));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getGamesSorted(mode = "rating_desc") {
  // Fetch all reviews
  const reviews = await getAllReviews();
  // group by game and calculate average ratings
  const games = aggregateByGame(reviews);

  switch (mode) {
    case "name_asc":
      return games.sort((a, b) =>
        a.game_name.localeCompare(b.game_name, undefined, {
          sensitivity: "base",
        })
      );
    case "name_desc":
      return games.sort((a, b) =>
        b.game_name.localeCompare(a.game_name, undefined, {
          sensitivity: "base",
        })
      );
    case "rating_asc":
      return games.sort((a, b) => a.average - b.average);
    default: // rating_desc
      return games.sort((a, b) => b.average - a.average);
  }
}
