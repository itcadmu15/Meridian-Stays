function MetricCard({ label, value, hint, icon: Icon, tone = "cream" }) {
  const toneStyles =
    tone === "rose" ? "bg-cream-100 text-plum-800" : "bg-cream-50 text-plum-800";

  return (
    <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs uppercase tracking-[0.25em] text-slate-500">{label}</p>
          <p className="mt-2 truncate font-serif text-3xl font-semibold text-plum-800">{value}</p>
          {hint ? <p className="mt-2 text-xs leading-5 text-slate-500">{hint}</p> : null}
        </div>

        {Icon ? (
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneStyles}`}
          >
            <Icon size={20} strokeWidth={1.7} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default MetricCard;
