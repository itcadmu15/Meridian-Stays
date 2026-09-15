const API_BASE = "http://127.0.0.1:8000/api/v1";

async function request(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "Something went wrong";
    try {
      const data = await response.json();
      message = data.detail || message;
    } catch {
      // Ignore non-JSON error responses
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const getCleaningTasks = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.unit_id) params.set("unit_id", filters.unit_id);
  if (filters.status) params.set("status", filters.status);
  if (filters.date_from) params.set("date_from", filters.date_from);
  if (filters.date_to) params.set("date_to", filters.date_to);

  const query = params.toString();

  return request(
    `/cleaning-tasks${query ? `?${query}` : ""}`
  );
};

export const createCleaningTask = (task) =>
  request("/cleaning-tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });

export const updateCleaningTask = (id, task) =>
  request(`/cleaning-tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(task),
  });

export const deleteCleaningTask = (id) =>
  request(`/cleaning-tasks/${id}`, {
    method: "DELETE",
  });