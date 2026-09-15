import { formatCurrency, formatDateRange, nightsBetween } from "../../utils/format";

/**
 * Booking summary built strictly from real data: nightly rate from the unit
 * listing, nights from the selected dates. The backend reservation contract has
 * no service-fee concept, so none is shown.
 */
function BookingSummary({ listing, booking }) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const rate = Number(listing?.nightly_rate || 0);
  const subtotal = nights > 0 ? nights * rate : null;

  return (
    <aside className="min-w-0 overflow-hidden rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
      <p className="font-serif text-2xl font-semibold text-plum-800">Booking Summary</p>

      <div className="mt-5 space-y-4 rounded-3xl bg-cream-50 p-5 text-sm text-slate-600">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-medium text-plum-800">{listing?.name || "Selected property"}</p>
            <p className="mt-1 break-words">{listing?.location || "Location not provided"}</p>
          </div>
          <p className="shrink-0 font-serif text-lg font-semibold text-plum-800">
            {formatCurrency(rate)}
            <span className="ml-1 text-[11px] font-normal text-slate-500">/night</span>
          </p>
        </div>

        <div className="space-y-2 border-t border-cream-200 pt-4">
          <div className="flex items-center justify-between gap-3">
            <span>Dates</span>
            <span className="text-right">{formatDateRange(booking.checkIn, booking.checkOut)}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Guests</span>
            <span>{booking.guests || 0}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span>Nights</span>
            <span>{nights > 0 ? nights : "—"}</span>
          </div>
        </div>

        <div className="space-y-2 border-t border-cream-200 pt-4">
          <div className="flex items-center justify-between gap-3">
            <span>
              {formatCurrency(rate)} × {nights > 0 ? nights : "—"} night
              {nights === 1 ? "" : "s"}
            </span>
            <span>{subtotal !== null ? formatCurrency(subtotal) : "—"}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-base font-semibold text-plum-800">
            <span>Total</span>
            <span>{subtotal !== null ? formatCurrency(subtotal) : "—"}</span>
          </div>
          <p className="pt-1 text-xs leading-5 text-slate-400">
            The final total is confirmed by the Meridian Stays backend when your booking is
            created.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default BookingSummary;
