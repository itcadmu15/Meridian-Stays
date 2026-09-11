import { request } from "./api";

const UNIT_LISTINGS_PATH = "/api/v1/unit-listings";

export function getUnitListings(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  const query = search.toString();

  return request(`${UNIT_LISTINGS_PATH}${query ? `?${query}` : ""}`);
}

export function getUnitListing(unitId) {
  return request(`${UNIT_LISTINGS_PATH}/${unitId}`);
}

export function createUnitListing(payload) {
  return request(UNIT_LISTINGS_PATH, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUnitListing(unitId, payload) {
  return request(`${UNIT_LISTINGS_PATH}/${unitId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteUnitListing(unitId) {
  return request(`${UNIT_LISTINGS_PATH}/${unitId}`, {
    method: "DELETE",
  });
}
