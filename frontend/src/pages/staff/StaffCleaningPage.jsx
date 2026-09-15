import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import Loading from "../../components/common/Loading";
import ErrorMsg from "../../components/common/ErrorMsg";
import EmptyState from "../../components/common/EmptyState";
import { getUnitListings } from "../../services/unitListingService";
import { listReservations } from "../../services/reservationService";
import { formatDate, todayISO } from "../../utils/format";

function StaffCleaningPage() {
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [listingData, reservationData] = await Promise.all([
        getUnitListings(),
        listReservations(),
      ]);

      setListings(Array.isArray(listingData) ? listingData : []);
      setReservations(Array.isArray(reservationData) ? reservationData : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load the cleaning schedule.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadData();
  }, []);

  const today = todayISO();

  const listingByPropertyId = useMemo(() => {
    const map = {};
    listings.forEach((listing) => {
      if (listing.property_id) map[listing.property_id] = listing;
    });
    return map;
  }, [listings]);

  const cleaningGroups = useMemo(() => {
    // Derived honestly from reservation data:
    //  - "Due today": units with a check-out today (clean before next guest)
    //  - "Upcoming": units with a check-out in the next 3 days
    //  - "Ready": active units with no same-day turnover pressure
    const dueToday = [];
    const upcoming = [];

    reservations.forEach((reservation) => {
      if (reservation.status === "cancelled" || !reservation.property_id) return;
      if (!listingByPropertyId[reservation.property_id]) return;

      if (reservation.check_out === today) {
        dueToday.push(reservation);
      } else if (reservation.check_out > today && reservation.check_out <= addDays(today, 3)) {
        upcoming.push(reservation);
      }
    });

    const unitsWithPressure = new Set(
      [...dueToday, ...upcoming].map((reservation) => reservation.property_id)
    );

    const ready = listings.filter(
      (listing) =>
        listing.status === "active" &&
        listing.property_id &&
        !unitsWithPressure.has(listing.property_id)
    );

    return { dueToday, upcoming, ready };
  }, [reservations, listings, listingByPropertyId, today]);

  const renderUnitRow = (reservation, note) => {
    const listing = listingByPropertyId[reservation.property_id];

    return (
      <div
        key={`${reservation.id}-${note}`}
        className="flex flex-col gap-2 rounded-2xl bg-cream-50 p-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-plum-800">
            {listing?.name || "Unit"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {note} · {formatDate(reservation.check_out)}
            {listing?.location ? ` · ${listing.location}` : ""}
          </p>
        </div>

        <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-medium text-plum-800 ring-1 ring-cream-200">
          {reservation.check_out === today ? "Cleaning due" : "Scheduled"}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Operations &gt; Cleaning</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          Cleaning Schedule
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Units requiring cleaning, derived from real check-outs. Statuses reflect the
          reservation lifecycle.
        </p>
      </div>

      {loading ? <Loading label="Loading cleaning schedule..." /> : null}
      {!loading && error ? (
        <ErrorMsg
          title="Unable to load the cleaning schedule."
          message={error}
          onRetry={loadData}
        />
      ) : null}

      {!loading && !error ? (
        <div className="grid gap-5 lg:grid-cols-3">
          <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-plum-800" />
              <h2 className="font-serif text-xl font-semibold text-plum-800">Due today</h2>
            </div>

            <div className="mt-4 space-y-3">
              {cleaningGroups.dueToday.length === 0 ? (
                <p className="text-sm text-slate-500">No check-outs today.</p>
              ) : (
                cleaningGroups.dueToday.map((reservation) =>
                  renderUnitRow(reservation, "Checked out")
                )
              )}
            </div>
          </section>

          <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-plum-800">Next 3 days</h2>

            <div className="mt-4 space-y-3">
              {cleaningGroups.upcoming.length === 0 ? (
                <p className="text-sm text-slate-500">No check-outs in the next 3 days.</p>
              ) : (
                cleaningGroups.upcoming.map((reservation) =>
                  renderUnitRow(reservation, "Turnover coming")
                )
              )}
            </div>
          </section>

          <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm">
            <h2 className="font-serif text-xl font-semibold text-plum-800">Guest-ready units</h2>

            <div className="mt-4 space-y-3">
              {cleaningGroups.ready.length === 0 ? (
                <EmptyState
                  title="No units available."
                  message="No active unit listings are linked to properties yet."
                />
              ) : (
                cleaningGroups.ready.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-cream-50 p-4"
                  >
                    <p className="min-w-0 truncate text-sm font-medium text-plum-800">
                      {listing.name}
                    </p>
                    <span className="w-fit shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-plum-800 ring-1 ring-cream-200">
                      Ready
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      ) : null}

      {!loading && !error ? (
        <p className="text-xs leading-5 text-slate-500">
          Note: task assignments and vendor management are not yet provided by the backend,
          so this view shows cleaning pressure derived from reservations only.
        </p>
      ) : null}
    </div>
  );
}

function addDays(isoDate, days) {
  const date = new Date(isoDate);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export default StaffCleaningPage;
