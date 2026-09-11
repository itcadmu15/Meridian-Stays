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

export async function resolveGuestId() {
  const storedGuestId = getStoredGuestId();
  if (storedGuestId) return storedGuestId;

  const reservations = await listReservations();
  const firstReservation = reservations?.[0];

  if (firstReservation?.guest_id) {
    setStoredGuestId(firstReservation.guest_id);
    return firstReservation.guest_id;
  }

  return null;
}

export function getGuest(guestId) {
  return request(`/api/v1/guests/${guestId}`);
}