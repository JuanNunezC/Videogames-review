export async function searchGames(query) {
  const clientId = process.env.REACT_APP_IGDB_CLIENT_ID;
  const accessToken = process.env.REACT_APP_IGDB_ACCESS_TOKEN;

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      "Content-Type": "text/plain",
    },
    body: `search "${query}"; fields name,cover.url,first_release_date,rating; limit 10;`,
  });

  if (!response.ok) throw new Error("IGDB API request failed");
  return response.json();
}
