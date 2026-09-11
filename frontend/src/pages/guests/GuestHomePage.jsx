import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestSearchBar from "../../components/guests/GuestSearchBar";
import FeaturedPropertyCard from "../../components/guests/FeaturedPropertyCard";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import { getUnitListings } from "../../services/unitListingService";

function GuestHomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ location: "", checkIn: "", checkOut: "", guests: 2 });

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getUnitListings();
        setListings(Array.isArray(data) ? data : []);
      } catch (loadError) {
        setError(loadError.message || "Unable to load listings.");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    const lowerLocation = filters.location.toLowerCase();

    return listings.filter((listing) => {
      const matchesLocation = !lowerLocation || `${listing?.location || ""} ${listing?.name || ""}`.toLowerCase().includes(lowerLocation);
      return matchesLocation && listing?.status !== "inactive";
    });
  }, [filters.location, listings]);

  return (
    <div className="space-y-10">
      {/* ================= HERO ================= */}
      <section className="overflow-hidden rounded-[32px] border border-cream-200 bg-plum-900 shadow-sm">
        <div className="relative min-h-[440px] sm:min-h-[480px] lg:min-h-[540px]">
          {/* Property imagery */}
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=80"
            alt="Meridian Stays boutique hotel suite"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />

          {/* Plum scrim so white text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-plum-950/85 via-plum-900/55 to-plum-950/20" />

          {/* Hero content */}
          <div className="relative z-10 flex h-full min-h-[inherit] flex-col px-5 py-8 text-white sm:px-8 md:px-12 md:py-12">
            <div className="max-w-2xl space-y-5">
              <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white backdrop-blur-sm sm:text-xs">
                Meridian Stays
              </span>

              <h1 className="font-serif text-4xl font-semibold leading-[1.15] sm:text-5xl md:text-6xl">
                Find Your Perfect Stay
              </h1>

              <p className="max-w-xl text-sm leading-7 text-white/90 sm:text-base">
                Beautiful homes. Unforgettable experiences. Handpicked boutique stays where every detail feels like home.
              </p>
            </div>
          </div>
        </div>

        {/* Search bar overlaps the hero edge */}
        <div className="relative z-20 -mt-12 px-4 pb-6 sm:px-8 sm:pb-8 md:px-12">
          <GuestSearchBar filters={filters} onChange={setFilters} />
        </div>
      </section>

      {/* ================= FEATURED PROPERTIES ================= */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-plum-800">Featured Properties</h2>
            <p className="mt-1 text-sm text-slate-500">Browse the latest available listings.</p>
          </div>

          {!loading && !error && filteredListings.length > 0 ? (
            <p className="text-sm text-slate-500">
              {filteredListings.length} {filteredListings.length === 1 ? "stay" : "stays"} available
            </p>
          ) : null}
        </div>

        {loading ? <Loading label="Loading listings..." /> : null}
        {!loading && error ? <ErrorMsg title="Unable to load guest listings." message={error} /> : null}
        {!loading && !error && filteredListings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-rose-300 bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-serif text-2xl font-semibold text-plum-800">No available listings found.</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting your search filters.</p>
          </div>
        ) : null}

        {!loading && !error && filteredListings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredListings.map((listing) => (
              <FeaturedPropertyCard
                key={listing.id}
                listing={listing}
                onClick={() => navigate(`/guest/unit-listings/${listing.id}`, { state: { listing } })}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default GuestHomePage;