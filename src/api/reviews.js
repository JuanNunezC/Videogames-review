import { db } from "../firebase";
import { doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";

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
