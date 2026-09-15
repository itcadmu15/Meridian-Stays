import { useMemo } from "react";
import { formatCurrency } from "../../utils/format";

/**
 * Simple horizontal bar chart built from real data (no chart library needed).
 * Rows are `{ label, value }`; values are rendered proportionally with the
 * currency formatting consistent with the rest of the app.
 */
function BarChart({ title, subtitle, data = [], emptyMessage = "No data available." }) {
  const rows = useMemo(() => {
    return data
      .filter((row) => row && row.label && Number.isFinite(Number(row.value)))
      .map((row) => ({ ...row, value: Number(row.value) }));
  }, [data]);

  const maxValue = Math.max(...rows.map((row) => row.value), 0);

  return (
    <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
      {title ? (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-2xl font-semibold text-plum-800">{title}</h2>
          {subtitle ? (
            <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{subtitle}</span>
          ) : null}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <div className="mt-5 space-y-3.5">
          {rows.map((row) => (
            <div key={row.label} className="min-w-0">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-plum-800">{row.label}</span>
                <span className="shrink-0 text-slate-600">{formatCurrency(row.value)}</span>
              </div>

              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-cream-50">
                <div
                  className="h-full rounded-full bg-plum-800"
                  style={{ width: maxValue > 0 ? `${(row.value / maxValue) * 100}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default BarChart;
