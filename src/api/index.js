const Base = (
  import.meta.env.MODE === "production"
    ? import.meta.env.VITE_API_BASE_URL_DEPLOYMENT
    : import.meta.env.VITE_API_BASE_URL
).replace(/\/?$/, "/");

export async function searchGames(query, { signal } = {}) {
  const q = encodeURIComponent(query.trim());
  const response = await fetch(`${Base}search-games/?query=${q}`, { signal });
  if (!response.ok) {
    const text = await response.text();
    throw new Error("API request failed");
  }
  const data = await response.json();
  return data;
}

export async function GetGameById(id, { signal } = {}) {
  const response = await fetch(`${Base}game/${id}/`, { signal });

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
  await fetch(`${Base}auth/csrf/`, { credentials: "include" });
}

export async function createSession(token) {
  const csrfToken = getCsrf();
  const response = await fetch(`${Base}auth/session/`, {
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
  const response = await fetch(`${Base}auth/logout/`, {
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

export async function getProfile() {
  try {
    const res = await fetch(`${Base}profile/`, { credentials: "include" });
    if (res.status === 401) return null;
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
