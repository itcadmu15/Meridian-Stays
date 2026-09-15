import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency } from "../../utils/format";

function UnitPerformance({ listings = [] }) {
  const topListings = [...listings]
    .sort((a, b) => Number(b.nightly_rate || 0) - Number(a.nightly_rate || 0))
    .slice(0, 5);

  return (
    <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-semibold text-plum-800">Unit Performance</h2>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">By rate</span>
      </div>

      {topListings.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No unit listings yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {topListings.map((listing) => (
            <Link
              key={listing.id}
              to={`/unit-listings/${listing.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl bg-cream-50 px-4 py-3 transition hover:bg-cream-100"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-plum-800">{listing.name}</p>
                <p className="truncate text-xs text-slate-500">
                  {listing.location || "Location not set"}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge status={listing.status} />
                <p className="text-sm font-semibold text-plum-800">
                  {formatCurrency(listing.nightly_rate)}
                  <span className="ml-1 text-[11px] font-normal text-slate-500">/night</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default UnitPerformance;
