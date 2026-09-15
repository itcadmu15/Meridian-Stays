import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, ReceiptText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ErrorMsg from "../../components/common/ErrorMsg";
import { getReservation } from "../../services/reservationService";
import { formatCurrency, formatDateRange } from "../../utils/format";

function BookingConfirmationPage() {
  const location = useLocation();

  // After booking: state carries { reservation, listing, guest }.
  // From My Bookings: state carries { reservation, propertyName }.
  const stateReservation = location.state?.reservation || null;
  const listing = location.state?.listing || null;
  const propertyName =
    location.state?.propertyName || location.state?.listing?.name || null;

  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  const reservation = stateReservation || detail;
  const reservationId = location.state?.reservationId;

  useEffect(() => {
    if (stateReservation || !reservationId) return;

    let cancelled = false;

    const loadDetail = async () => {
      setLoadingDetail(true);
      setDetailError("");

      try {
        const data = await getReservation(reservationId);
        if (!cancelled) setDetail(data);
      } catch (loadError) {
        if (!cancelled) {
          setDetailError(loadError.message || "Unable to load booking details.");
        }
      } finally {
        if (!cancelled) setLoadingDetail(false);
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [stateReservation, reservationId]);

  if (loadingDetail) {
    return <Loader2 className="mx-auto mt-16 animate-spin text-plum-800" size={32} />;
  }

  if (!reservation) {
    return (
      <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-cream-200 bg-white p-6 text-center shadow-sm sm:p-8">
        {detailError ? (
          <ErrorMsg title="Unable to load booking details." message={detailError} />
        ) : (
          <>
            <h1 className="font-serif text-3xl font-semibold text-plum-800">
              Booking Details
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Open a booking from My Bookings to see its confirmation details.
            </p>
          </>
        )}
        <Link
          to="/guest/bookings"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700"
        >
          <ReceiptText size={16} />
          Go to My Bookings
        </Link>
      </div>
    );
  }

  const folio = reservation.folio || null;
  // Total comes from the backend folio when present; otherwise it's derived from
  // the listing's real nightly rate — never invented.
  const total =
    folio?.balance ??
    (listing ? Number(listing.nightly_rate || 0) * nightsBetweenSafe(reservation) : null);
  const hasRealTotal = folio?.balance != null || listing != null;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5">
      <div className="rounded-[32px] border border-cream-200 bg-white p-6 text-center shadow-sm sm:p-8">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cream-100 text-plum-800">
          <CheckCircle2 size={42} />
        </div>

        <h1 className="mt-6 font-serif text-3xl font-semibold text-plum-800 sm:text-4xl">
          {stateReservation ? "Booking Confirmed!" : "Booking Details"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {propertyName || listing?.name || "Your stay"} ·{" "}
          {formatDateRange(reservation.check_in, reservation.check_out)}
        </p>
        {reservation.guest?.email || location.state?.guest?.email ? (
          <p className="mt-2 text-sm text-slate-500">
            Confirmation sent to{" "}
            {reservation.guest?.email || location.state?.guest?.email}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/guest/bookings"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700"
          >
            <ReceiptText size={16} />
            View My Bookings
          </Link>
          <Link
            to="/guest"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Reservation facts (only fields the API actually returns) */}
      <section className="rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-cream-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Reservation ID
            </p>
            <p className="mt-2 break-all text-sm font-medium text-plum-800">
              {reservation.id}
            </p>
          </div>
          <div className="rounded-2xl bg-cream-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Status</p>
            <p className="mt-2 text-sm font-medium capitalize text-plum-800">
              {String(reservation.status).replace("_", " ")}
            </p>
          </div>
          <div className="rounded-2xl bg-cream-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Stay</p>
            <p className="mt-2 text-sm font-medium text-plum-800">
              {formatDateRange(reservation.check_in, reservation.check_out)}
            </p>
          </div>
          <div className="rounded-2xl bg-cream-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total</p>
            <p className="mt-2 text-sm font-medium text-plum-800">
              {hasRealTotal && total !== null && total !== undefined
                ? formatCurrency(total)
                : "—"}
            </p>
            {!hasRealTotal ? (
              <p className="mt-1 text-xs text-slate-400">
                The final total is confirmed by the backend.
              </p>
            ) : null}
          </div>
        </div>

        {folio?.line_items?.length ? (
          <div className="mt-4 rounded-2xl border border-cream-200 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Folio</p>
            <div className="mt-3 space-y-2">
              {folio.line_items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="min-w-0 break-words text-slate-600">
                    {item.description}
                  </span>
                  <span className="shrink-0 font-medium text-plum-800">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function nightsBetweenSafe(reservation) {
  if (!reservation?.check_in || !reservation?.check_out) return 0;
  const nights =
    (new Date(reservation.check_out).getTime() -
      new Date(reservation.check_in).getTime()) /
    (1000 * 60 * 60 * 24);
  return Number.isNaN(nights) || nights <= 0 ? 0 : Math.round(nights);
}

export default BookingConfirmationPage;
