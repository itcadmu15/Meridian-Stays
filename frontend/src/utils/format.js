export function formatCurrency(value) {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericValue);
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

export function nightsBetween(start, end) {
  if (!start || !end) return 0;

  const startDate = new Date(start);
  const endDate = new Date(end);
  const diff = endDate.getTime() - startDate.getTime();

  if (Number.isNaN(diff) || diff <= 0) return 0;

  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}