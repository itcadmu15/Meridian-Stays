import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";
import { formatDateRange } from "../../utils/format";

function UpcomingBooking({ reservations = [], propertyNames = {} }) {
  const upcoming = reservations.slice(0, 5);

  return (
    <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-2xl font-semibold text-plum-800">Upcoming Bookings</h2>
        <Link
          to="/owner/bookings"
          className="inline-flex items-center gap-1 text-sm font-medium text-plum-800 hover:text-plum-600"
        >
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      {upcoming.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No upcoming bookings yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {upcoming.map((reservation) => (
            <div key={reservation.id} className="rounded-2xl bg-cream-50 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 truncate text-sm font-medium text-plum-800">
                  {propertyNames[reservation.property_id] ||
                    `Property ${String(reservation.property_id || "").slice(0, 8)}…`}
                </p>
                <StatusBadge status={reservation.status} />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {formatDateRange(reservation.check_in, reservation.check_out)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default UpcomingBooking;
