import { request } from "./api";
import { listReservations } from "./reservationService";

const CURRENT_GUEST_KEY = "meridian-current-guest-id";

export function getStoredGuestId() {
  return window.localStorage.getItem(CURRENT_GUEST_KEY);
}

export function setStoredGuestId(guestId) {
  window.localStorage.setItem(CURRENT_GUEST_KEY, guestId);
}

export function clearStoredGuestId() {
  window.localStorage.removeItem(CURRENT_GUEST_KEY);
}

/**
 * Resolve which backend guest record the current frontend session refers to.
 *
 * The backend has no auth yet, so the "logged in" guest is matched against real
 * seeded data: first a guest whose email matches the session email, otherwise
 * the guest on the newest reservation. Returns null when the backend has no
 * guests/reservations yet — callers must handle that with an honest empty state.
 */
export async function resolveGuestId(sessionEmail) {
  const storedGuestId = getStoredGuestId();
  if (storedGuestId) return storedGuestId;

  // Match the login email against the real guest directory when available.
  if (sessionEmail) {
    try {
      const guests = await request(
        `/api/v1/guests?search=${encodeURIComponent(sessionEmail)}`
      );
      const match = (Array.isArray(guests) ? guests : []).find(
        (guest) => (guest.email || "").toLowerCase() === sessionEmail.toLowerCase()
      );
      if (match?.id) {
        setStoredGuestId(match.id);
        return match.id;
      }
    } catch {
      // Guest directory unavailable — fall through to reservation matching.
    }
  }

  try {
    const reservations = await listReservations();
    const firstReservation = Array.isArray(reservations) ? reservations[0] : null;

    if (firstReservation?.guest_id) {
      setStoredGuestId(firstReservation.guest_id);
      return firstReservation.guest_id;
    }
  } catch {
    // Backend unreachable — surface as "no guest resolved".
  }

  return null;
}

export function getGuest(guestId) {
  return request(`/api/v1/guests/${guestId}`);
}

export function getGuests(params = {}) {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });

  const query = search.toString();

  return request(`/api/v1/guests${query ? `?${query}` : ""}`);
}