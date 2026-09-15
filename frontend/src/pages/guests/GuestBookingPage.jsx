import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import BookingSummary from "../../components/guests/BookingSummary";
import { createReservation } from "../../services/reservationService";
import { getUnitListing } from "../../services/unitListingService";
import {
  getGuest,
  resolveGuestId,
  setStoredGuestId,
} from "../../services/guestService";
import { getSessionUser } from "../../services/authService";
import { nightsBetween } from "../../utils/format";

const EMPTY_FORM = {
  fullName: "",
  email: "",
  phone: "",
  guests: "2",
  checkIn: "",
  checkOut: "",
  terms: false,
};

function GuestBookingPage() {
  const { unitId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [listing, setListing] = useState(location.state?.listing || null);
  const [loading, setLoading] = useState(!location.state?.listing);
  const [pageError, setPageError] = useState("");
  const [guestId, setGuestId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [form, setForm] = useState(() => {
    // Prefill dates from the guest's search when available.
    const search = location.state?.searchContext;
    return {
      ...EMPTY_FORM,
      checkIn: search?.checkIn || "",
      checkOut: search?.checkOut || "",
      guests: search?.guests || "2",
    };
  });

  const loadGuestContext = useCallback(async () => {
    const sessionUser = getSessionUser();
    const resolved = await resolveGuestId(sessionUser?.email);
    setGuestId(resolved || "");

    // Prefill contact details from the resolved guest profile when available.
    if (resolved) {
      try {
        const guest = await getGuest(resolved);
        setForm((current) => ({
          ...current,
          fullName: current.fullName || guest.name || "",
          email: current.email || guest.email || "",
          phone: current.phone || guest.phone || "",
        }));
      } catch {
        // Profile prefill is best-effort only.
      }
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate guest context
    loadGuestContext();
  }, [loadGuestContext]);

  const loadListing = useCallback(async () => {
    try {
      const data = await getUnitListing(unitId);
      setListing(data);
    } catch (loadError) {
      setPageError(loadError.message || "Unable to load property details.");
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    if (listing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadListing();
  }, [listing, loadListing]);

  const validateField = (name, value) => {
    switch (name) {
      case "fullName":
        return value.trim() ? "" : "Full name is required.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? ""
          : "A valid email is required.";
      case "phone":
        return value.trim() ? "" : "Phone number is required.";
      case "guests":
        return Number(value) > 0 ? "" : "Guests must be greater than zero.";
      case "checkIn":
        return value ? "" : "Check-in date is required.";
      case "checkOut":
        return value ? "" : "Check-out date is required.";
      case "terms":
        return value ? "" : "You must accept the terms to continue.";
      default:
        return "";
    }
  };

  const validationError = useMemo(() => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return "A valid email is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (Number(form.guests) <= 0) return "Guests must be greater than zero.";
    if (!form.checkIn || !form.checkOut) return "Check-in and check-out dates are required.";
    if (nightsBetween(form.checkIn, form.checkOut) <= 0)
      return "Check-out must be after check-in.";
    if (!form.terms) return "You must accept the terms to continue.";
    return "";
  }, [form]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;

    setForm((current) => ({ ...current, [name]: nextValue }));
    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(name, nextValue),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (validationError) {
      setError(validationError);
      return;
    }

    if (!guestId) {
      setError(
        "No guest profile is available yet. Sign in as the demo guest and make sure the Meridian Stays backend has seeded guests before confirming."
      );
      return;
    }

    // The reservation API references properties; the unit must be linked.
    if (!listing?.property_id) {
      setError(
        "This listing is not linked to a backend property yet, so the reservation API cannot be submitted."
      );
      return;
    }

    setSaving(true);
    setError("");

    try {
      const reservation = await createReservation({
        guest_id: guestId,
        property_id: listing.property_id,
        rate_plan_id: null,
        check_in: form.checkIn,
        check_out: form.checkOut,
      });

      setStoredGuestId(guestId);
      navigate("/guest/booking-confirmation", {
        state: {
          reservation,
          listing,
          guest: { fullName: form.fullName, email: form.email, guests: form.guests },
        },
      });
    } catch (submitError) {
      setError(submitError.message || "Unable to confirm booking.");
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) return <Loading label="Loading booking form..." />;
  if (pageError && !listing)
    return <ErrorMsg title="Unable to load booking details." message={pageError} />;

  const inputClasses =
    "w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate(`/guest/unit-listings/${unitId}`)}
            className="hover:text-plum-800"
          >
            {listing?.name || "Property"}
          </button>{" "}
          &gt; Booking
        </p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          Complete Your Booking
        </h1>
        <p className="text-sm text-slate-500">Almost there! Please provide your details.</p>
      </div>

      {error ? (
        <ErrorMsg title="Booking could not be completed." message={error} />
      ) : null}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,380px)]">
        <div className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
          <p className="font-serif text-2xl font-semibold text-plum-800">Guest Information</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-plum-800">Full Name *</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={inputClasses}
              />
              {fieldErrors.fullName ? (
                <p className="text-xs text-red-600">{fieldErrors.fullName}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Email *</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClasses}
              />
              {fieldErrors.email ? (
                <p className="text-xs text-red-600">{fieldErrors.email}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Phone *</span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className={inputClasses}
              />
              {fieldErrors.phone ? (
                <p className="text-xs text-red-600">{fieldErrors.phone}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Number of Guests *</span>
              <input
                name="guests"
                type="number"
                min="1"
                value={form.guests}
                onChange={handleChange}
                className={inputClasses}
              />
              {fieldErrors.guests ? (
                <p className="text-xs text-red-600">{fieldErrors.guests}</p>
              ) : null}
            </label>

            <span />

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Check-in *</span>
              <input
                name="checkIn"
                type="date"
                value={form.checkIn}
                onChange={handleChange}
                className={inputClasses}
              />
              {fieldErrors.checkIn ? (
                <p className="text-xs text-red-600">{fieldErrors.checkIn}</p>
              ) : null}
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-plum-800">Check-out *</span>
              <input
                name="checkOut"
                type="date"
                value={form.checkOut}
                onChange={handleChange}
                className={inputClasses}
              />
              {fieldErrors.checkOut ? (
                <p className="text-xs text-red-600">{fieldErrors.checkOut}</p>
              ) : null}
            </label>

            <label className="flex items-start gap-3 rounded-2xl bg-cream-50 px-4 py-3 md:col-span-2">
              <input
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-cream-200 accent-plum-800"
              />
              <span className="text-sm text-slate-600">
                I agree to the Meridian Stays booking terms and cancellation policy.
              </span>
            </label>
            {fieldErrors.terms ? (
              <p className="-mt-2 text-xs text-red-600 md:col-span-2">{fieldErrors.terms}</p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/guest/unit-listings/${unitId}`)}
              className="rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
            >
              Back to property
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
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
