import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import Loading from "../../components/common/Loading";
import ErrorMsg from "../../components/common/ErrorMsg";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import { getUnitListings } from "../../services/unitListingService";
import { listReservations } from "../../services/reservationService";
import { formatDate, formatTime, todayISO, tomorrowISO } from "../../utils/format";

function StaffTurnoversPage() {
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
      setError(loadError.message || "Unable to load turnovers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadData();
  }, []);

  const listingByPropertyId = useMemo(() => {
    const map = {};
    listings.forEach((listing) => {
      if (listing.property_id) map[listing.property_id] = listing;
    });
    return map;
  }, [listings]);

  const today = useMemo(() => todayISO(), []);
  const tomorrow = useMemo(() => tomorrowISO(), []);

  const turnovers = useMemo(() => {
    // A turnover is a real upcoming transition: check-out (unit needs cleaning
    // before the next guest) or check-in (unit must be guest-ready).
    return reservations
      .filter(
        (reservation) =>
          reservation.status !== "cancelled" &&
          (reservation.check_in <= tomorrow || reservation.check_out <= tomorrow) &&
          reservation.check_out >= today
      )
      .map((reservation) => {
        const listing = listingByPropertyId[reservation.property_id];
        const isCheckOutDay = reservation.check_out <= tomorrow && reservation.check_out >= today;

        return {
          id: `${reservation.id}-${
            isCheckOutDay ? "checkout" : "checkin"
          }`,
          unitName: listing?.name || `Property ${String(reservation.property_id || "").slice(0, 8)}…`,
          location: listing?.location || "",
          type: isCheckOutDay ? "Check-out" : "Check-in",
          date: isCheckOutDay ? reservation.check_out : reservation.check_in,
          time: isCheckOutDay
            ? listing?.check_out_time
            : listing?.check_in_time,
          status: reservation.status,
        };
      })
      .sort((a, b) => (a.date < b.date ? -1 : 1));
  }, [reservations, listingByPropertyId, today, tomorrow]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Operations &gt; Turnovers</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          Upcoming Turnovers
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Check-ins and check-outs in the next 24 hours, derived from live reservations.
        </p>
      </div>

      {loading ? <Loading label="Loading turnovers..." /> : null}
      {!loading && error ? (
        <ErrorMsg title="Unable to load turnovers." message={error} onRetry={loadData} />
      ) : null}
      {!loading && !error && turnovers.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No upcoming turnovers."
          message="When reservations check in or check out within the next day, they will appear here."
        />
      ) : null}

      {!loading && !error && turnovers.length > 0 ? (
        <div className="space-y-3">
          {turnovers.map((turnover) => (
            <article
              key={turnover.id}
              className="flex flex-col gap-3 rounded-[24px] border border-cream-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      turnover.type === "Check-out"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-cream-100 text-plum-800"
                    }`}
                  >
                    {turnover.type}
                  </span>
                  <h2 className="truncate font-serif text-xl font-semibold text-plum-800">
                    {turnover.unitName}
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {formatDate(turnover.date)}
                  {turnover.time ? ` · ${formatTime(turnover.time)}` : " · flexible time"}
                  {turnover.location ? ` · ${turnover.location}` : ""}
                </p>
              </div>

              <StatusBadge status={turnover.status} />
            </article>
          ))}
        </div>
      ) : null}

      {!loading && !error ? (
        <p className="text-xs text-slate-500">
          Tip: a check-out followed by a same-day check-in means the unit needs priority
          cleaning. See{" "}
          <Link
            to="/staff/cleaning"
            className="font-medium text-plum-800 underline underline-offset-4"
          >
            Cleaning Tasks
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

export default StaffTurnoversPage;
