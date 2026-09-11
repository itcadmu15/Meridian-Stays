// Derive the API origin from the current dev-server origin so localhost/127.0.0.1
// both work with the backend CORS allowlist (http://localhost:5173 by default).
// VITE_API_BASE_URL still takes precedence when explicitly configured.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;
  if (response.status !== 204) {
    data = isJson ? await response.json() : await response.text();
  }

  if (!response.ok) {
    const detail =
      data && typeof data === "object"
        ? data.detail || data.message || JSON.stringify(data)
        : data || response.statusText;

    throw new Error(detail || "Request failed");
  }

  return data;
}

export { API_BASE_URL, request };