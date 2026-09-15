import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestSearchBar from "../../components/guests/GuestSearchBar";
import FeaturedPropertyCard from "../../components/guests/FeaturedPropertyCard";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import { getUnitListings } from "../../services/unitListingService";
import { nightsBetween } from "../../utils/format";

const DEFAULT_FILTERS = { location: "", checkIn: "", checkOut: "", guests: "2" };

function GuestHomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadListings();
  }, []);

  const searchedListings = useMemo(() => {
    const location = appliedFilters.location.trim().toLowerCase();

    return listings.filter((listing) => {
      // Guests browse bookable stays; only active listings are shown.
      if (listing?.status !== "active") return false;

      const matchesLocation =
        !location ||
        `${listing?.location || ""} ${listing?.name || ""}`
          .toLowerCase()
          .includes(location);

      return matchesLocation;
    });
  }, [listings, appliedFilters.location]);

  const datesValid =
    !appliedFilters.checkIn ||
    !appliedFilters.checkOut ||
    nightsBetween(appliedFilters.checkIn, appliedFilters.checkOut) > 0;

  const handleSearch = (nextFilters) => {
    if (
      nextFilters.checkIn &&
      nextFilters.checkOut &&
      nightsBetween(nextFilters.checkIn, nextFilters.checkOut) <= 0
    ) {
      return;
    }
    setAppliedFilters(nextFilters);
  };

  const handleViewListing = (listing) => {
    navigate(`/guest/unit-listings/${listing.id}`, {
      state: {
        listing,
        searchContext: appliedFilters.checkIn ? appliedFilters : undefined,
      },
    });
  };

  return (
    <div className="space-y-10">
      {/* ================= HERO ================= */}
      <section className="overflow-hidden rounded-[32px] border border-cream-200 bg-plum-900 shadow-sm">
        <div className="relative min-h-[300px] sm:min-h-[360px] lg:min-h-[420px]">
          <img
            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1800&q=80"
            alt="Meridian Stays boutique stay"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-plum-950/85 via-plum-900/55 to-plum-950/20" />

          <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-center px-5 py-10 text-white sm:px-8 md:px-12 md:py-12">
            <div className="max-w-2xl space-y-5">
              <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-white sm:text-xs">
                Meridian Stays
              </span>

              <h1 className="font-serif text-4xl font-semibold leading-[1.15] sm:text-5xl md:text-6xl">
                Find Your Perfect Stay
              </h1>

              <p className="max-w-xl text-sm leading-7 text-white/90 sm:text-base">
                Beautiful homes. Unforgettable experiences. Handpicked boutique stays where
                every detail feels like home.
              </p>
            </div>
          </div>
        </div>

        {/* Search bar sits just below the hero, overlapping its edge */}
        <div className="relative z-20 -mt-10 px-4 pb-2 sm:-mt-12 sm:px-8 md:px-12">
          <GuestSearchBar filters={filters} onChange={setFilters} onSearch={handleSearch} />
        </div>
      </section>

      {/* ================= LISTINGS ================= */}
      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-plum-800">
              {appliedFilters.location ? "Search Results" : "Featured Properties"}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {appliedFilters.location
                ? `Stays matching "${appliedFilters.location}".`
                : "Browse the latest available listings."}
            </p>
          </div>

          {!loading && !error && searchedListings.length > 0 ? (
            <p className="text-sm text-slate-500">
              {searchedListings.length} {searchedListings.length === 1 ? "stay" : "stays"}{" "}
              available
            </p>
          ) : null}
        </div>

        {!datesValid ? (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            Check-out must be after check-in. Adjust your dates and search again.
          </div>
        ) : null}

        {loading ? <Loading label="Loading listings..." /> : null}
        {!loading && error ? (
          <ErrorMsg
            title="Unable to load guest listings."
            message={error}
            onRetry={loadListings}
          />
        ) : null}
        {!loading && !error && searchedListings.length === 0 ? (
          <EmptyState
            title={
              listings.length === 0
                ? "No available listings right now."
                : "No stays match your search."
            }
            message={
              listings.length === 0
                ? "Please check back soon — new properties are added regularly."
                : "Try a different destination or clear your search."
            }
            action={
              listings.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setFilters(DEFAULT_FILTERS);
                    setAppliedFilters(DEFAULT_FILTERS);
                  }}
                  className="rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
                >
                  Clear search
                </button>
              ) : null
            }
          />
        ) : null}

        {!loading && !error && searchedListings.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {searchedListings.map((listing) => (
              <FeaturedPropertyCard
                key={listing.id}
                listing={listing}
                onClick={() => handleViewListing(listing)}
              />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}

export default GuestHomePage;
