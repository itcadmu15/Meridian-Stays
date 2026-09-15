import { clearStoredGuestId } from "./guestService";

const SESSION_KEY = "meridian-session-user";

/**
 * Simple frontend-only session (no roles, no RBAC — authorization is owned by the
 * backend team). A session is just a well-formed credential pair acknowledged by
 * the app; swap `submitLogin` for the real auth endpoint when it lands, without
 * touching callers.
 *
 * The `area` field ("owner" | "guest") only chooses which frontend experience
 * opens after login — it grants no permissions.
 */

function normalizeEmail(value) {
  return (value || "").trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

function validateCredentials({ email, password }) {
  if (!email.trim()) return "Email is required.";
  if (!isValidEmail(email)) return "Enter a valid email address.";
  if (!password) return "Password is required.";
  if (password.length < 4) return "Password must be at least 4 characters.";
  return "";
}

function getSessionUser() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setSessionUser(user) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

async function submitLogin({ email, password, area = "owner" }) {
  // Single demo account per area for this module. Replace with a POST to the
  // auth endpoint once the backend exposes one.
  const DEMO_ACCOUNTS = {
    owner: { email: "owner@meridianstays.com", password: "meridian" },
    guest: { email: "guest@meridianstays.com", password: "meridian" },
  };

  const demo = DEMO_ACCOUNTS[area] || DEMO_ACCOUNTS.owner;

  if (normalizeEmail(email) !== demo.email || password !== demo.password) {
    throw new Error("Invalid email or password. Please try again.");
  }

  return { email: normalizeEmail(email), name: area === "guest" ? "Jamie Rivera" : "Priyam Sharma", area };
}

async function login({ email, password, area = "owner" }) {
  const validationError = validateCredentials({ email, password });
  if (validationError) {
    throw new Error(validationError);
  }

  const user = await submitLogin({ email, password, area });
  setSessionUser(user);
  return user;
}

function logout() {
  window.localStorage.removeItem(SESSION_KEY);
  clearStoredGuestId();
}

function isAuthenticated() {
  return getSessionUser() !== null;
}

/**
 * Guard helper for the authenticated layouts. Returns true when the current
 * session may view the area, so an owner session and a guest session each see
 * only their own experience.
 *
 * There are deliberately only two login experiences (owner / guest). The
 * Staff/Operations view is an operational frontend view opened with the owner
 * session — it is navigation, not a third role, and grants no extra privileges.
 */
function isAreaAuthenticated(area) {
  const user = getSessionUser();
  if (user === null) return false;

  const sessionArea = user.area || "owner";
  if (area === "staff") {
    return sessionArea === "owner";
  }
  return sessionArea === area;
}

export {
  getSessionUser,
  setSessionUser,
  login,
  logout,
  isAuthenticated,
  isAreaAuthenticated,
};
