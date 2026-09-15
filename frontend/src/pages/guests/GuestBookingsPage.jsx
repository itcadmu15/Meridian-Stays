import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import BookingCard from "../../components/guests/BookingCard";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import { listReservations } from "../../services/reservationService";
import { resolveGuestId } from "../../services/guestService";
import { getUnitListings } from "../../services/unitListingService";
import { getSessionUser } from "../../services/authService";
import { todayISO } from "../../utils/format";

function GuestBookingsPage() {
  const navigate = useNavigate();
  const [guestId, setGuestId] = useState("");
  const [propertyNames, setPropertyNames] = useState({});
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("upcoming");

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const sessionUser = getSessionUser();
      const resolvedGuestId = await resolveGuestId(sessionUser?.email);
      setGuestId(resolvedGuestId || "");

      // Map property_id -> unit listing name so cards show real property names.
      const listingsData = await getUnitListings().catch(() => []);
      const names = {};
      (Array.isArray(listingsData) ? listingsData : []).forEach((listing) => {
        if (listing.property_id) names[listing.property_id] = listing.name;
      });
      setPropertyNames(names);

      const data = await listReservations();
      const allReservations = Array.isArray(data) ? data : [];
      setReservations(
        resolvedGuestId
          ? allReservations.filter(
              (reservation) => reservation.guest_id === resolvedGuestId
            )
          : []
      );
    } catch (loadError) {
      setError(loadError.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadBookings();
  }, [loadBookings]);

  const today = useMemo(() => todayISO(), []);

  const categorized = useMemo(() => {
    const upcoming = [];
    const past = [];
    const cancelled = [];

    reservations.forEach((reservation) => {
      if (reservation.status === "cancelled") {
        cancelled.push(reservation);
      } else if (reservation.check_out >= today) {
        upcoming.push(reservation);
      } else {
        past.push(reservation);
      }
    });

    const byCheckIn = (a, b) => (a.check_in < b.check_in ? -1 : 1);
    return {
      upcoming: upcoming.sort(byCheckIn),
      past: past.sort((a, b) => (a.check_in > b.check_in ? -1 : 1)),
      cancelled: cancelled.sort(byCheckIn),
    };
  }, [reservations, today]);

  const tabCounts = {
    upcoming: categorized.upcoming.length,
    past: categorized.past.length,
    cancelled: categorized.cancelled.length,
  };

  const visibleReservations = categorized[tab] || [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Guest &gt; Bookings</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          My Bookings
        </h1>
        <p className="text-sm text-slate-500">View and manage your reservations.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "past", label: "Past" },
          { key: "cancelled", label: "Cancelled" },
        ].map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              tab === item.key
                ? "bg-plum-800 text-white"
                : "bg-white text-slate-600 hover:bg-cream-50"
            }`}
          >
            {item.label} ({tabCounts[item.key]})
          </button>
        ))}
      </div>

      {loading ? <Loading label="Loading bookings..." /> : null}
      {!loading && error ? (
        <ErrorMsg title="Unable to load bookings." message={error} onRetry={loadBookings} />
      ) : null}
      {!loading && !error && visibleReservations.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={
            reservations.length === 0
              ? "No bookings yet."
              : `No ${tab} bookings.`
          }
          message={
            reservations.length === 0
              ? "When you book a stay, your reservations will appear here."
              : "Take a look at the other tabs, or plan your next trip."
          }
          action={
            reservations.length === 0 ? (
              <button
                type="button"
                onClick={() => navigate("/guest")}
                className="rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700"
              >
                Browse stays
              </button>
            ) : null
          }
        />
      ) : null}

      {!loading && !error && visibleReservations.length > 0 ? (
        <div className="space-y-4">
          {visibleReservations.map((reservation) => (
            <BookingCard
              key={reservation.id}
              booking={reservation}
              propertyName={propertyNames[reservation.property_id]}
              onView={() =>
                navigate("/guest/booking-confirmation", {
                  state: {
                    reservation,
                    propertyName: propertyNames[reservation.property_id],
                  },
                })
              }
            />
          ))}
        </div>
      ) : null}

      {!loading && !error && !guestId && reservations.length === 0 ? (
        <p className="text-xs leading-5 text-slate-500">
          Your bookings are matched to your guest profile in the Meridian Stays backend. No
          profile has been resolved yet, so this list stays empty until one exists.
        </p>
      ) : null}
    </div>
  );
}

export default GuestBookingsPage;
