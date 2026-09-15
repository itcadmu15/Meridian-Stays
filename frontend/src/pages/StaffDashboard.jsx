import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BedDouble, CalendarDays, Sparkles } from "lucide-react";
import Loading from "../components/common/Loading";
import ErrorMsg from "../components/common/ErrorMsg";
import MetricCard from "../components/common/MetricCard";
import { getUnitListings } from "../services/unitListingService";
import { listReservations } from "../services/reservationService";
import { formatDate, formatTime, todayISO } from "../utils/format";

function StaffDashboard() {
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
      setError(loadError.message || "Unable to load operations data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadData();
  }, []);

  const today = useMemo(() => todayISO(), []);

  const listingByPropertyId = useMemo(() => {
    const map = {};
    listings.forEach((listing) => {
      if (listing.property_id) map[listing.property_id] = listing;
    });
    return map;
  }, [listings]);

  const checkoutsToday = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservation.status !== "cancelled" &&
          reservation.check_out === today &&
          listingByPropertyId[reservation.property_id]
      ),
    [reservations, today, listingByPropertyId]
  );

  const checkinsToday = useMemo(
    () =>
      reservations.filter(
        (reservation) =>
          reservation.status !== "cancelled" &&
          reservation.check_in === today &&
          listingByPropertyId[reservation.property_id]
      ),
    [reservations, today, listingByPropertyId]
  );

  const activeUnits = listings.filter((listing) => listing.status === "active").length;

  const nextTransitions = useMemo(() => {
    return reservations
      .filter(
        (reservation) =>
          reservation.status !== "cancelled" &&
          (reservation.check_in >= today || reservation.check_out >= today) &&
          listingByPropertyId[reservation.property_id]
      )
      .sort((a, b) => {
        const aDate = a.check_in < a.check_out ? a.check_in : a.check_out;
        const bDate = b.check_in < b.check_out ? b.check_in : b.check_out;
        return aDate < bDate ? -1 : 1;
      })
      .slice(0, 6);
  }, [reservations, today, listingByPropertyId]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Operations &gt; Dashboard</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          Operations Dashboard
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Today&apos;s turnovers and unit readiness across Meridian Stays.
        </p>
      </div>

      {loading ? <Loading label="Loading operations data..." /> : null}
      {!loading && error ? (
        <ErrorMsg title="Unable to load operations data." message={error} onRetry={loadData} />
      ) : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <MetricCard
              label="Check-outs today"
              value={checkoutsToday.length}
              hint="Units needing cleaning"
              icon={Sparkles}
            />
            <MetricCard
              label="Check-ins today"
              value={checkinsToday.length}
              hint="Units going guest-ready"
              icon={CalendarDays}
            />
            <MetricCard
              label="Active units"
              value={activeUnits}
              hint={`${listings.length} total listings`}
              icon={BedDouble}
            />
          </div>

          <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl font-semibold text-plum-800">
                Next transitions
              </h2>
              <Link
                to="/staff/turnovers"
                className="text-sm font-medium text-plum-800 underline underline-offset-4 hover:text-plum-600"
              >
                View turnovers
              </Link>
            </div>

            {nextTransitions.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">
                No upcoming check-ins or check-outs yet.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {nextTransitions.map((reservation) => {
                  const listing = listingByPropertyId[reservation.property_id];
                  const isCheckInNext = reservation.check_in >= today;

                  return (
                    <div
                      key={reservation.id}
                      className="flex flex-col gap-2 rounded-2xl bg-cream-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-plum-800">
                          {listing?.name || "Unit"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {isCheckInNext ? "Check-in" : "Check-out"}{" "}
                          {formatDate(
                            isCheckInNext ? reservation.check_in : reservation.check_out
                          )}
                          {isCheckInNext
                            ? listing?.check_in_time
                              ? ` · ${formatTime(listing.check_in_time)}`
                              : ""
                            : listing?.check_out_time
                              ? ` · ${formatTime(listing.check_out_time)}`
                              : ""}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-white px-3 py-1.5 text-xs font-medium capitalize text-plum-800 ring-1 ring-cream-200">
                        {String(reservation.status).replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

export default StaffDashboard;
