const STATUS_STYLES = {
  active: "bg-cream-100 text-plum-800",
  confirmed: "bg-cream-100 text-plum-800",
  draft: "bg-amber-50 text-amber-700",
  pending: "bg-amber-50 text-amber-700",
  inactive: "bg-slate-100 text-slate-600",
  cancelled: "bg-red-50 text-red-700",
};

function StatusBadge({ status, className = "" }) {
  const normalized = String(status || "").toLowerCase();
  const style = STATUS_STYLES[normalized] || "bg-cream-100 text-plum-800";
  const label = normalized.replace(/_/g, " ") || "unknown";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${style} ${className}`}
    >
      {label}
    </span>
  );
}

export default StatusBadge;
