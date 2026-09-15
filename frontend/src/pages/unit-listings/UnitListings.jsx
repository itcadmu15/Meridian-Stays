import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Plus, RefreshCw } from "lucide-react";
import Loading from "../../components/common/Loading";
import ErrorMsg from "../../components/common/ErrorMsg";
import EmptyState from "../../components/common/EmptyState";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import UnitListingCard from "../../components/unit-listings/UnitListingCard";
import UnitListingFilters from "../../components/unit-listings/UnitListingFilters";
import { deleteUnitListing, getUnitListings } from "../../services/unitListingService";

function UnitListingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deletingListing, setDeletingListing] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadListings = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getUnitListings();
      setListings(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load unit listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return listings.filter((listing) => {
      const matchesSearch = `${listing?.name || ""} ${listing?.location || ""} ${
        listing?.description || ""
      }`
        .toLowerCase()
        .includes(lowerSearch);
      const matchesStatus = status === "all" ? true : listing?.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [listings, search, status]);

  const counts = useMemo(
    () => ({
      total: listings.length,
      active: listings.filter((listing) => listing.status === "active").length,
      inactive: listings.filter((listing) => listing.status === "inactive").length,
      draft: listings.filter((listing) => listing.status === "draft").length,
    }),
    [listings]
  );

  const hasFilters = search.trim() !== "" || status !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
  };

  const handleDelete = async () => {
    if (!deletingListing) return;

    setDeleting(true);

    try {
      await deleteUnitListing(deletingListing.id);
      setListings((current) =>
        current.filter((listing) => listing.id !== deletingListing.id)
      );
      setDeletingListing(null);
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete unit listing.");
      setDeletingListing(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {location.state?.flash ? (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 size={18} className="shrink-0" />
          {location.state.flash}
        </div>
      ) : null}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Home &gt; Unit Listings</p>
          <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
            Unit Listings
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            Manage your vacation rental units across every city.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={loadListings}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-white px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50 disabled:opacity-60 sm:w-auto"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("/unit-listings/new")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 sm:w-auto"
          >
            <Plus size={18} />
            Add Unit
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[24px] border border-cream-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total units</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-plum-800">{counts.total}</p>
        </div>
        <div className="rounded-[24px] border border-cream-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Active units</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-plum-800">{counts.active}</p>
        </div>
        <div className="rounded-[24px] border border-cream-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Inactive units</p>
          <p className="mt-2 font-serif text-3xl font-semibold text-plum-800">
            {counts.inactive}
            {counts.draft > 0 ? (
              <span className="ml-2 text-sm font-normal text-slate-500">
                +{counts.draft} draft
              </span>
            ) : null}
          </p>
        </div>
      </div>

      <UnitListingFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        onClear={clearFilters}
        hasFilters={hasFilters}
      />

      {loading ? <Loading label="Loading unit listings..." /> : null}

      {!loading && error ? (
        <ErrorMsg
          title="Unable to load unit listings."
          message={error}
          onRetry={loadListings}
        />
      ) : null}

      {!loading && !error && filteredListings.length === 0 ? (
        <EmptyState
          title={
            listings.length === 0
              ? "No unit listings available."
              : "No units match your filters."
          }
          message={
            listings.length === 0
              ? "Add your first unit to start managing it in Meridian Stays."
              : "Try a different search term or clear the filters."
          }
          action={
            listings.length === 0 ? (
              <button
                type="button"
                onClick={() => navigate("/unit-listings/new")}
                className="rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700"
              >
                Add your first unit
              </button>
            ) : hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
              >
                Clear filters
              </button>
            ) : null
          }
        />
      ) : null}

      {!loading && !error && filteredListings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing) => (
            <UnitListingCard
              key={listing.id}
              listing={listing}
              onView={() => navigate(`/unit-listings/${listing.id}`)}
              onEdit={() => navigate(`/unit-listings/${listing.id}/edit`)}
              onDelete={() => setDeletingListing(listing)}
            />
          ))}
        </div>
      ) : null}

      <ConfirmDialog
        open={deletingListing !== null}
        title="Delete this unit listing?"
        message={`"${
          deletingListing?.name || "This unit"
        }" will be permanently removed from Meridian Stays. This cannot be undone.`}
        confirmLabel="Delete unit"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeletingListing(null)}
      />
    </div>
  );
}

export default UnitListingsPage;
