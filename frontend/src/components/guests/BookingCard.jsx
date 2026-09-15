import { CalendarDays, MapPin } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatDateRange } from "../../utils/format";

function BookingCard({ booking, onView, propertyName }) {
  return (
    <article className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <h3 className="break-words font-serif text-xl font-semibold text-plum-800 sm:text-2xl">
            {propertyName || "Reservation"}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500 sm:gap-4">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} className="text-plum-500" />
              {formatDateRange(booking?.check_in, booking?.check_out)}
            </span>
            {propertyName ? null : (
              <span className="inline-flex items-center gap-2 break-all">
                <MapPin size={15} className="text-plum-500" />
                Property {booking?.property_id}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <StatusBadge status={booking?.status} />
          {onView ? (
            <button
              type="button"
              onClick={onView}
              className="rounded-2xl bg-plum-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-plum-700"
            >
              View details
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default BookingCard;
