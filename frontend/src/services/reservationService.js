import { request } from "./api";

const RESERVATIONS_PATH = "/api/v1/reservations";

export function listReservations(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  const query = search.toString();

  return request(`${RESERVATIONS_PATH}${query ? `?${query}` : ""}`);
}

export function getReservation(reservationId) {
  return request(`${RESERVATIONS_PATH}/${reservationId}`);
}

export function createReservation(payload) {
  return request(RESERVATIONS_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}