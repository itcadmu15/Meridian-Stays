import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import BookingSummary from "../../components/guests/BookingSummary";
import { createReservation } from "../../services/reservationService";
import { getUnitListing } from "../../services/unitListingService";
import { resolveGuestId, setStoredGuestId } from "../../services/guestService";

function GuestBookingPage() {
  const { unitId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [listing, setListing] = useState(location.state?.listing || null);
  const [loading, setLoading] = useState(!location.state?.listing);
  const [guestId, setGuestId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", guests: 2, checkIn: "", checkOut: "", terms: false });

  useEffect(() => {
    const hydrate = async () => {
      const resolvedGuestId = await resolveGuestId();
      if (resolvedGuestId) setGuestId(resolvedGuestId);
    };

    hydrate();
  }, []);

  useEffect(() => {
    if (listing) return;

    const loadListing = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getUnitListing(unitId);
        setListing(data);
      } catch (loadError) {
        setError(loadError.message || "Unable to load property details.");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [listing, unitId]);

  const validationError = useMemo(() => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "A valid email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (Number(form.guests) <= 0) return "Guests must be greater than zero.";
    if (!form.checkIn || !form.checkOut) return "Check-in and check-out dates are required.";
    if (new Date(form.checkOut) <= new Date(form.checkIn)) return "Check-out must be after check-in.";
    if (!form.terms) return "You must accept the terms to continue.";
    return "";
  }, [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!guestId) {
      setError("No guest profile is available yet. Load a booking or seeded guest before confirming.");
      return;
    }

    const reservationPropertyId = listing?.property_id;
    const fallbackPropertyId = reservationPropertyId || location.state?.reservation?.property_id || null;

    if (!fallbackPropertyId) {
      setError("This listing is not linked to a backend property yet, so the reservation API cannot be submitted.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const reservation = await createReservation({
        guest_id: guestId,
        property_id: fallbackPropertyId,
        rate_plan_id: null,
        check_in: form.checkIn,
        check_out: form.checkOut,
      });

      setStoredGuestId(guestId);
      navigate("/guest/booking-confirmation", {
        state: {
          reservation,
          listing,
          guest: form,
        },
      });
    } catch (submitError) {
      setError(submitError.message || "Unable to confirm booking.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading label="Loading booking form..." />;
  if (error && !listing) return <ErrorMsg title="Unable to load booking details." message={error} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Booking</p>
        <h1 className="font-serif text-4xl font-semibold text-plum-800">Complete Your Booking</h1>
        <p className="text-sm text-slate-500">Almost there! Please provide your details.</p>
      </div>

      {error ? <ErrorMsg title="Booking could not be completed." message={error} /> : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,380px)]">
        <div className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
          <p className="font-serif text-2xl font-semibold text-plum-800">Guest Information</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-plum-800">Full Name *</span>
              <input value={form.fullName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Email *</span>
              <input type="email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Phone *</span>
              <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10" />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-plum-800">Number of Guests</span>
              <input type="number" min="1" value={form.guests} onChange={(event) => setForm((current) => ({ ...current, guests: Number(event.target.value) }))} className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Check-in *</span>
              <input type="date" value={form.checkIn} onChange={(event) => setForm((current) => ({ ...current, checkIn: event.target.value }))} className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10" />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Check-out *</span>
              <input type="date" value={form.checkOut} onChange={(event) => setForm((current) => ({ ...current, checkOut: event.target.value }))} className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10" />
            </label>

            <label className="flex items-start gap-3 rounded-2xl bg-[#faf7f8] px-4 py-3 md:col-span-2">
              <input type="checkbox" checked={form.terms} onChange={(event) => setForm((current) => ({ ...current, terms: event.target.checked }))} className="mt-1 h-4 w-4 rounded border-rose-300 text-plum-800 accent-plum-800 focus:ring-plum-500" />
              <span className="text-sm text-slate-600">I agree to the Meridian Stays booking terms and cancellation policy.</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={saving} className="inline-flex w-full items-center justify-center rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">
              {saving ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>
        </div>

        <BookingSummary listing={listing} booking={form} />
      </div>
    </form>
  );
}

export default GuestBookingPage;