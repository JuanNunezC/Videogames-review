export async function searchGames(query, { signal } = {}) {
  const q = encodeURIComponent(query.trim());
  const response = await fetch(`/api/search-games/?query=${q}`, { signal });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("API request failed");
  }
  const data = await response.json();
  return data;
}

export async function GetGameById(id, { signal } = {}) {
  const response = await fetch(`/api/game/${id}/`, { signal });

  if (!response.ok) {
    const text = await response.text();
    throw new Error("API request failed");
  }
  const data = await response.json();
  return data;
}

function getCsrf() {
  return (
    document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("csrftoken="))
      ?.split("=")[1] || ""
  );
}

export async function ensureCsrf() {
  await fetch("/api/auth/csrf/", { credentials: "include" });
}

export async function createSession(token) {
  const csrfToken = getCsrf();
  const response = await fetch("/api/auth/session/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    credentials: "include",
    body: JSON.stringify({ token }),
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create session");
  }
  return response.json();
}

export async function logoutSession() {
  const csrfToken = getCsrf();
  const response = await fetch("/api/auth/logout/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    credentials: "include",
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to logout session");
  }
  return response.json();
}
<<<<<<< Updated upstream
=======

export async function getProfile() {
  const response = await fetch("/api/profile/", { credentials: "include" });

  if (response.status === 401) return null;

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to logout session");
  }
  return response.json();
}
>>>>>>> Stashed changes
