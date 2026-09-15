import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import Loading from "../components/common/Loading";
import ErrorMsg from "../components/common/ErrorMsg";
import EmptyState from "../components/common/EmptyState";
import MetricCard from "../components/common/MetricCard";
import BarChart from "../components/common/BarChart";
import { getUnitListings } from "../services/unitListingService";
import { listReservations } from "../services/reservationService";
import { formatCurrency, nightsBetween } from "../utils/format";

const STATUS_OPTIONS = ["confirmed", "checked_in", "checked_out", "cancelled"];

function OwnerReportsPage() {
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState("all");
  const [status, setStatus] = useState("all");

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
      setError(loadError.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadData();
  }, []);

  // Months that actually contain reservation check-ins (no fabricated timeline).
  const monthOptions = useMemo(() => {
    const months = new Set();
    reservations.forEach((reservation) => {
      if (reservation.check_in) months.add(String(reservation.check_in).slice(0, 7));
    });
    return Array.from(months).sort();
  }, [reservations]);

  const rateByPropertyId = useMemo(() => {
    const rates = {};
    listings.forEach((listing) => {
      if (listing.property_id) rates[listing.property_id] = Number(listing.nightly_rate || 0);
    });
    return rates;
  }, [listings]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesMonth = month === "all" || String(reservation.check_in).slice(0, 7) === month;
      const matchesStatus = status === "all" || reservation.status === status;
      return matchesMonth && matchesStatus;
    });
  }, [reservations, month, status]);

  const summary = useMemo(() => {
    let bookingValue = 0;
    let nights = 0;

    filteredReservations.forEach((reservation) => {
      if (reservation.status === "cancelled") return;
      const rate = rateByPropertyId[reservation.property_id];
      if (rate === undefined) return;
      const reservationNights = nightsBetween(reservation.check_in, reservation.check_out);
      nights += reservationNights;
      bookingValue += reservationNights * rate;
    });

    return { bookingValue, nights, count: filteredReservations.length };
  }, [filteredReservations, rateByPropertyId]);

  const revenueRows = useMemo(() => {
    const byProperty = {};
    filteredReservations.forEach((reservation) => {
      if (reservation.status === "cancelled") return;
      const rate = rateByPropertyId[reservation.property_id];
      if (rate === undefined) return;
      const reservationNights = nightsBetween(reservation.check_in, reservation.check_out);
      byProperty[reservation.property_id] =
        (byProperty[reservation.property_id] || 0) + reservationNights * rate;
    });

    return Object.entries(byProperty)
      .map(([propertyId, value]) => ({
        label:
          listings.find((listing) => listing.property_id === propertyId)?.name ||
          `Property ${String(propertyId).slice(0, 8)}…`,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredReservations, rateByPropertyId, listings]);

  const nightsByMonth = useMemo(() => {
    const byMonth = {};
    filteredReservations.forEach((reservation) => {
      if (reservation.status === "cancelled") return;
      const key = String(reservation.check_in).slice(0, 7);
      byMonth[key] = (byMonth[key] || 0) + nightsBetween(reservation.check_in, reservation.check_out);
    });
    return Object.entries(byMonth)
      .map(([key, value]) => ({ label: key, value }))
      .sort((a, b) => (a.label < b.label ? -1 : 1));
  }, [filteredReservations]);

  const statusCounts = useMemo(() => {
    const counts = {};
    STATUS_OPTIONS.forEach((option) => {
      counts[option] = reservations.filter((reservation) => reservation.status === option).length;
    });
    return counts;
  }, [reservations]);

  const activeUnits = listings.filter((listing) => listing.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Home &gt; Reports</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">Reports</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Revenue and occupancy signals derived from your live Meridian Stays bookings.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-[24px] border border-cream-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        <select
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          aria-label="Filter by check-in month"
          className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-plum-800 outline-none focus:border-plum-500 sm:w-auto"
        >
          <option value="all">All months</option>
          {monthOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter by status"
          className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-2.5 text-sm text-plum-800 outline-none focus:border-plum-500 sm:w-auto"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option.replace("_", " ")}
            </option>
          ))}
        </select>

        {(month !== "all" || status !== "all") && (
          <button
            type="button"
            onClick={() => {
              setMonth("all");
              setStatus("all");
            }}
            className="w-fit rounded-2xl border border-cream-200 px-4 py-2 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? <Loading label="Loading reports..." /> : null}
      {!loading && error ? (
        <ErrorMsg title="Unable to load reports." message={error} onRetry={loadData} />
      ) : null}

      {!loading && !error && reservations.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No performance data available."
          message="Reports will light up once reservations exist in the Meridian Stays backend."
        />
      ) : null}

      {!loading && !error && reservations.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <MetricCard
              label="Booking value"
              value={formatCurrency(summary.bookingValue)}
              hint={`${summary.nights} nights booked`}
            />
            <MetricCard label="Reservations" value={summary.count} hint="In the current filter" />
            <MetricCard
              label="Active units"
              value={activeUnits}
              hint={`${listings.length} total listings`}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <BarChart
              title="Booking value by unit"
              subtitle="Nights × rate"
              data={revenueRows}
              emptyMessage="No booking value in the current filter."
            />

            <BarChart
              title="Nights by check-in month"
              subtitle="Booked nights"
              data={nightsByMonth}
              emptyMessage="No booked nights in the current filter."
            />
          </div>

          <section className="rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="font-serif text-2xl font-semibold text-plum-800">Booking status mix</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {STATUS_OPTIONS.map((option) => (
                <div key={option} className="rounded-2xl bg-cream-50 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {option.replace("_", " ")}
                  </p>
                  <p className="mt-2 font-serif text-2xl font-semibold text-plum-800">
                    {statusCounts[option]}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">
              Values are derived from real reservations and the nightly rates of linked unit
              listings. Reservations without a linked unit listing are excluded from value
              totals.
            </p>
          </section>
        </>
      ) : null}
    </div>
  );
}

export default OwnerReportsPage;
