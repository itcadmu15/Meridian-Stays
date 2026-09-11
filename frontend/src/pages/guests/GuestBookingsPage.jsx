import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard from "../../components/guests/BookingCard";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import { listReservations } from "../../services/reservationService";
import { resolveGuestId } from "../../services/guestService";

function GuestBookingsPage() {
  const navigate = useNavigate();
  const [guestId, setGuestId] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("upcoming");

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true);
      setError("");

      try {
        const resolvedGuestId = await resolveGuestId();
        setGuestId(resolvedGuestId || "");

        const data = await listReservations();
        const allReservations = Array.isArray(data) ? data : [];
        const guestReservations = resolvedGuestId
          ? allReservations.filter((reservation) => reservation.guest_id === resolvedGuestId)
          : allReservations;
        setReservations(guestReservations);
      } catch (loadError) {
        setError(loadError.message || "Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const status = reservation?.status || "confirmed";
      if (tab === "upcoming") return status === "confirmed" || status === "checked_in";
      if (tab === "past") return status === "checked_out";
      if (tab === "cancelled") return status === "cancelled";
      return true;
    });
  }, [reservations, tab]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Guest &gt; Bookings</p>
        <h1 className="font-serif text-4xl font-semibold text-plum-800">My Bookings</h1>
        <p className="text-sm text-slate-500">View and manage your reservations.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { key: "upcoming", label: "Upcoming" },
          { key: "past", label: "Past" },
          { key: "cancelled", label: "Cancelled" },
        ].map((item) => (
          <button key={item.key} type="button" onClick={() => setTab(item.key)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab === item.key ? "bg-plum-800 text-white" : "bg-white text-slate-600 hover:bg-cream-50"}`}>
            {item.label}
          </button>
        ))}
      </div>

      {loading ? <Loading label="Loading bookings..." /> : null}
      {!loading && error ? <ErrorMsg title="Unable to load bookings." message={error} /> : null}
      {!loading && !error && filteredReservations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose-300 bg-white px-6 py-14 text-center shadow-sm">
          <p className="font-serif text-2xl font-semibold text-plum-800">No bookings found.</p>
        </div>
      ) : null}

      {!loading && !error && filteredReservations.length > 0 ? (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <BookingCard key={reservation.id} booking={reservation} onView={() => navigate(`/guest/booking-confirmation`, { state: { reservation } })} />
          ))}
        </div>
      ) : null}

      {!guestId && !loading ? (
        <p className="text-sm text-slate-500">A guest profile was not resolved yet, so bookings may be empty until one exists.</p>
      ) : null}
    </div>
  );
}

export default GuestBookingsPage;