import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import Loading from "../components/common/Loading";
import ErrorMsg from "../components/common/ErrorMsg";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import { getUnitListings } from "../services/unitListingService";
import { listReservations } from "../services/reservationService";
import { formatDateRange, formatCurrency, nightsBetween, todayISO } from "../utils/format";

function OwnerBookingsPage() {
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [unitFilter, setUnitFilter] = useState("all");

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
      setError(loadError.message || "Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadData();
  }, []);

  const propertyNameByPropertyId = useMemo(() => {
    const names = {};
    listings.forEach((listing) => {
      if (listing.property_id) names[listing.property_id] = listing.name;
    });
    return names;
  }, [listings]);

  const filteredReservations = useMemo(() => {
    const today = todayISO();

    return reservations
      .filter((reservation) => {
        const matchesStatus =
          statusFilter === "all" ? true : reservation.status === statusFilter;
        const matchesUnit =
          unitFilter === "all" ? true : reservation.property_id === unitFilter;
        return matchesStatus && matchesUnit;
      })
      .sort((a, b) => {
        // Soonest upcoming first, then furthest past.
        const aFuture = a.check_out >= today;
        const bFuture = b.check_out >= today;
        if (aFuture !== bFuture) return aFuture ? -1 : 1;
        return a.check_in < b.check_in ? -1 : 1;
      });
  }, [reservations, statusFilter, unitFilter]);

  const rateByPropertyId = useMemo(() => {
    const rates = {};
    listings.forEach((listing) => {
      if (listing.property_id) rates[listing.property_id] = Number(listing.nightly_rate || 0);
    });
    return rates;
  }, [listings]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Home &gt; Bookings</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">Bookings</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Every reservation across your Meridian Stays units.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-[24px] border border-cream-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
          className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-plum-800 outline-none focus:border-plum-500 sm:w-auto"
        >
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked_in">Checked in</option>
          <option value="checked_out">Checked out</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={unitFilter}
          onChange={(event) => setUnitFilter(event.target.value)}
          aria-label="Filter by unit"
          className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-plum-800 outline-none focus:border-plum-500 sm:w-auto"
        >
          <option value="all">All units</option>
          {listings
            .filter((listing) => listing.property_id)
            .map((listing) => (
              <option key={listing.id} value={listing.property_id}>
                {listing.name}
              </option>
            ))}
        </select>

        {(statusFilter !== "all" || unitFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setUnitFilter("all");
            }}
            className="w-fit rounded-2xl border border-cream-200 px-4 py-2 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
          >
            Clear filters
          </button>
        )}

        <span className="text-sm text-slate-500 sm:ml-auto">
          {filteredReservations.length} of {reservations.length} bookings
        </span>
      </div>

      {loading ? <Loading label="Loading bookings..." /> : null}
      {!loading && error ? (
        <ErrorMsg title="Unable to load bookings." message={error} onRetry={loadData} />
      ) : null}
      {!loading && !error && filteredReservations.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={reservations.length === 0 ? "No bookings yet." : "No bookings match these filters."}
          message={
            reservations.length === 0
              ? "Reservations created through the guest experience will appear here."
              : "Try a different status or unit filter."
          }
        />
      ) : null}

      {!loading && !error && filteredReservations.length > 0 ? (
        <div className="overflow-x-auto rounded-[24px] border border-cream-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-cream-200 text-xs uppercase tracking-[0.15em] text-slate-500">
                <th className="px-5 py-4 font-medium">Property</th>
                <th className="px-5 py-4 font-medium">Check-in → Check-out</th>
                <th className="px-5 py-4 font-medium">Nights</th>
                <th className="px-5 py-4 font-medium">Est. value</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => {
                const rate = rateByPropertyId[reservation.property_id];
                const nights = nightsBetween(reservation.check_in, reservation.check_out);

                return (
                  <tr key={reservation.id} className="border-b border-cream-100 last:border-0">
                    <td className="px-5 py-4 font-medium text-plum-800">
                      {propertyNameByPropertyId[reservation.property_id] || (
                        <span className="break-all text-slate-500">
                          Property {String(reservation.property_id || "—").slice(0, 13)}…
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDateRange(reservation.check_in, reservation.check_out)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{nights || "—"}</td>
                    <td className="px-5 py-4 text-slate-600">
                      {rate !== undefined && nights > 0 ? formatCurrency(nights * rate) : "—"}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={reservation.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      {!loading && !error && reservations.length === 0 ? (
        <p className="text-sm text-slate-500">
          Tip: guests book from the{" "}
          <Link to="/guest" className="font-medium text-plum-800 underline underline-offset-4">
            guest experience
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

export default OwnerBookingsPage;
