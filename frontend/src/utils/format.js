export function formatCurrency(value) {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericValue);
}

export function formatPercent(value, digits = 0) {
  const numericValue = Number(value || 0);
  return `${numericValue.toFixed(digits)}%`;
}

export function formatDate(value) {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatDateRange(start, end) {
  if (!start || !end) return "—";

  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function toISODate(value) {
  if (!value) return "";

  if (typeof value === "string") return value.slice(0, 10);

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().slice(0, 10);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function tomorrowISO() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function nightsBetween(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();

  if (Number.isNaN(diff) || diff <= 0) return 0;

  return Math.round(diff / (1000 * 60 * 60 * 24));
}

export function formatTime(value) {
  if (!value) return "Flexible";

  const match = /^(\d{1,2}):(\d{2})/.exec(String(value));
  if (!match) return value;

  const hours = Number(match[1]);
  const minutes = match[2];
  const suffix = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;

  return `${displayHours}:${minutes} ${suffix}`;
}