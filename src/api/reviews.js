import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function submitReview({ gameId, gameName, rating, user }) {
  if (!user || !user.uid) throw new Error("Usuario sin uid");

  const reviewId = `${gameId}_${user.uid}`;

  await setDoc(
    doc(db, "reviews", reviewId),
    {
      game_id: String(gameId),
      game_name: gameName,
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
