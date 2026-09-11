import { CalendarDays, MapPin, Users } from "lucide-react";
import { formatDateRange } from "../../utils/format";

function BookingCard({ booking, onView }) {
  return (
    <article className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          <h3 className="break-all font-serif text-xl font-semibold text-plum-800 sm:text-2xl">{booking?.propertyName || booking?.property_id || "Booking"}</h3>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500 sm:gap-4">
            <span className="inline-flex items-center gap-2"><MapPin size={15} className="text-[#8b4a6b]" />{booking?.location || "Location not available"}</span>
            <span className="inline-flex items-center gap-2"><CalendarDays size={15} className="text-[#8b4a6b]" />{formatDateRange(booking?.check_in, booking?.check_out)}</span>
            <span className="inline-flex items-center gap-2"><Users size={15} className="text-[#8b4a6b]" />{booking?.guests || "1"} guests</span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="rounded-full bg-cream-100 px-3 py-2 text-sm font-medium capitalize text-plum-800">{booking?.status?.replace("_", " ") || "confirmed"}</span>
          {onView ? (
            <button type="button" onClick={onView} className="rounded-2xl bg-plum-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-plum-700">
              View
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default BookingCard;