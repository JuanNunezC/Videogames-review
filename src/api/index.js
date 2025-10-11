export async function searchGames(query) {
  const q = encodeURIComponent(query.trim());
  const response = await fetch(`/api/search-games?query=${q}`);
  if (!response.ok) {
    const text = await response.text();
    throw new Error("API request failed");
  }
  const data = await response.json();
  return data;
}
