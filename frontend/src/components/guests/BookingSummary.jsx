import { formatCurrency, formatDateRange, nightsBetween } from "../../utils/format";

function BookingSummary({ listing, booking }) {
  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const subtotal = nights * Number(listing?.nightly_rate || 0);
  const serviceFee = subtotal > 0 ? subtotal * 0.08 : 0;
  const total = subtotal + serviceFee;

  return (
    <aside className="min-w-0 overflow-hidden rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6 lg:sticky lg:top-24">
      <p className="font-serif text-2xl font-semibold text-plum-800">Booking Summary</p>

      <div className="mt-5 space-y-4 rounded-3xl bg-cream-50 p-5 text-sm text-slate-600">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-medium text-plum-800">{listing?.name || "Selected property"}</p>
            <p className="mt-1 break-words">{listing?.location || "Location not provided"}</p>
          </div>
          <p className="shrink-0 font-serif text-lg font-semibold text-plum-800">{formatCurrency(listing?.nightly_rate)}</p>
        </div>

        <div className="space-y-2 border-t border-[#eadfe4] pt-4">
          <div className="flex items-center justify-between"><span>Check-in</span><span>{booking.checkIn || "—"}</span></div>
          <div className="flex items-center justify-between"><span>Check-out</span><span>{booking.checkOut || "—"}</span></div>
          <div className="flex items-center justify-between"><span>Guests</span><span>{booking.guests || 0}</span></div>
          <div className="flex items-center justify-between"><span>Nights</span><span>{nights}</span></div>
          <div className="flex items-center justify-between"><span>Stay</span><span>{formatDateRange(booking.checkIn, booking.checkOut)}</span></div>
        </div>

        <div className="space-y-2 border-t border-[#eadfe4] pt-4">
          <div className="flex items-center justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex items-center justify-between"><span>Service fee</span><span>{formatCurrency(serviceFee)}</span></div>
          <div className="flex items-center justify-between text-base font-semibold text-plum-800"><span>Total</span><span>{formatCurrency(total)}</span></div>
        </div>
      </div>
    </aside>
  );
}

export default BookingSummary;