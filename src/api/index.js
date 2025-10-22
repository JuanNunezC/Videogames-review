export async function searchGames(query, { signal } = {}) {
  const q = encodeURIComponent(query.trim());
  const response = await fetch(`/api/search-games?query=${q}`, { signal });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("API request failed");
  }
  const data = await response.json();
  return data;
}

export async function GetGameById(id, { signal } = {}) {
  const response = await fetch(`/api/game/${id}`, { signal });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("API request failed");
  }
  const data = await response.json();
  return data;
}
