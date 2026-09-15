import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BedDouble, CalendarCheck, Plus, TrendingUp } from "lucide-react";
import Loading from "../components/common/Loading";
import ErrorMsg from "../components/common/ErrorMsg";
import MetricCard from "../components/common/MetricCard";
import BarChart from "../components/common/BarChart";
import UnitPerformance from "../components/owner/UnitPerformance";
import UpcomingBooking from "../components/owner/UpcomingBooking";
import { getUnitListings } from "../services/unitListingService";
import { listReservations } from "../services/reservationService";
import { formatCurrency, formatPercent, todayISO } from "../utils/format";

function OwnerDashboard() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
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
      setError(loadError.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadDashboard();
  }, []);

  const activeListings = useMemo(
    () => listings.filter((listing) => listing.status === "active"),
    [listings]
  );

  const occupancy = useMemo(() => {
    // Derived from real data: share of active listings that have at least one
    // non-cancelled reservation touching today. No fabricated numbers.
    const today = todayISO();
    if (activeListings.length === 0) return null;

    const bookedPropertyIds = new Set(
      reservations
        .filter(
          (reservation) =>
            reservation.status !== "cancelled" &&
            reservation.check_in <= today &&
            reservation.check_out > today
        )
        .map((reservation) => reservation.property_id)
    );

    const bookedUnits = activeListings.filter(
      (listing) => listing.property_id && bookedPropertyIds.has(listing.property_id)
    ).length;

    return (bookedUnits / activeListings.length) * 100;
  }, [activeListings, reservations]);

  const upcomingReservations = useMemo(() => {
    const today = todayISO();

    return reservations
      .filter(
        (reservation) =>
          reservation.check_out >= today &&
          ["confirmed", "checked_in"].includes(reservation.status)
      )
      .sort((a, b) => (a.check_in < b.check_in ? -1 : 1));
  }, [reservations]);

  const revenueRows = useMemo(() => {
    // Real booking value per property: nights × the linked unit's nightly rate.
    // Only reservations that map to a known unit listing are counted.
    const rateByProperty = {};
    listings.forEach((listing) => {
      if (listing.property_id) {
        rateByProperty[listing.property_id] = Number(listing.nightly_rate || 0);
      }
    });

    const revenueByProperty = {};
    reservations
      .filter((reservation) => reservation.status !== "cancelled")
      .forEach((reservation) => {
        const rate = rateByProperty[reservation.property_id];
        if (rate === undefined) return;

        const nights = Math.max(
          0,
          Math.round(
            (new Date(reservation.check_out).getTime() -
              new Date(reservation.check_in).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        );

        revenueByProperty[reservation.property_id] =
          (revenueByProperty[reservation.property_id] || 0) + nights * rate;
      });

    return Object.entries(revenueByProperty)
      .map(([propertyId, value]) => ({
        label:
          listings.find((listing) => listing.property_id === propertyId)?.name ||
          `Property ${String(propertyId).slice(0, 8)}…`,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [listings, reservations]);

  if (loading) {
    return <Loading label="Loading dashboard..." />;
  }

  if (error) {
    return (
      <ErrorMsg title="Unable to load dashboard." message={error} onRetry={loadDashboard} />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Home &gt; Dashboard</p>
          <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
            Welcome back
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            A live snapshot of your Meridian Stays listings and bookings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/unit-listings/new")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 sm:w-auto"
        >
          <Plus size={18} />
          Add Unit
        </button>
      </div>

      {/* Metric cards — derived from real API data only */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Units"
          value={listings.length}
          hint={`${activeListings.length} active`}
          icon={BedDouble}
        />
        <MetricCard
          label="Occupancy Today"
          value={occupancy === null ? "No data" : formatPercent(occupancy)}
          hint="Active units with a stay in progress"
          icon={CalendarCheck}
        />
        <MetricCard
          label="Booking Value"
          value={formatCurrency(
            revenueRows.reduce((total, row) => total + row.value, 0)
          )}
          hint="Nights × rate across linked reservations"
          icon={TrendingUp}
        />
        <MetricCard
          label="Upcoming Bookings"
          value={upcomingReservations.length}
          hint="Confirmed or checked-in stays"
          icon={CalendarCheck}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <BarChart
          title="Booking Value by Unit"
          subtitle="Nights × rate"
          data={revenueRows}
          emptyMessage="No booking value yet — reservations linked to your unit listings will appear here."
        />
        <UnitPerformance listings={listings} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <UpcomingBooking
          reservations={upcomingReservations}
          propertyNames={Object.fromEntries(
            listings
              .filter((listing) => listing.property_id)
              .map((listing) => [listing.property_id, listing.name])
          )}
        />

        <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
          <h2 className="font-serif text-2xl font-semibold text-plum-800">Quick Actions</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => navigate("/unit-listings")}
              className="rounded-2xl bg-cream-50 px-4 py-4 text-left text-sm font-medium text-plum-800 transition hover:bg-cream-100"
            >
              Manage unit listings
              <span className="mt-1 block text-xs font-normal text-slate-500">
                View, add, edit or remove units
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/owner/bookings")}
              className="rounded-2xl bg-cream-50 px-4 py-4 text-left text-sm font-medium text-plum-800 transition hover:bg-cream-100"
            >
              Review bookings
              <span className="mt-1 block text-xs font-normal text-slate-500">
                All reservations across your units
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/owner/reports")}
              className="rounded-2xl bg-cream-50 px-4 py-4 text-left text-sm font-medium text-plum-800 transition hover:bg-cream-100"
            >
              View reports
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Revenue and occupancy trends
              </span>
            </button>
            <button
              type="button"
              onClick={() => navigate("/guests")}
              className="rounded-2xl bg-cream-50 px-4 py-4 text-left text-sm font-medium text-plum-800 transition hover:bg-cream-100"
            >
              Guest directory
              <span className="mt-1 block text-xs font-normal text-slate-500">
                Guests and their preferences
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default OwnerDashboard;
