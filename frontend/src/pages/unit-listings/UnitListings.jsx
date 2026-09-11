import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import Loading from "../../components/common/Loading";
import ErrorMsg from "../../components/common/ErrorMsg";
import UnitListingCard from "../../components/unit-listings/UnitListingCard";
import UnitListingFilters from "../../components/unit-listings/UnitListingFilters";
import { deleteUnitListing, getUnitListings } from "../../services/unitListingService";

function UnitListingsPage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [deletingId, setDeletingId] = useState("");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return listings.filter((listing) => {
      const matchesSearch = `${listing?.name || ""} ${listing?.location || ""} ${listing?.description || ""}`
        .toLowerCase()
        .includes(lowerSearch);
      const matchesStatus = status === "all" ? true : listing?.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [listings, search, status]);

  const handleDelete = async (listingId) => {
    const confirmed = window.confirm("Delete this unit listing?");
    if (!confirmed) return;

    setDeletingId(listingId);

    try {
      await deleteUnitListing(listingId);
      setListings((current) => current.filter((listing) => listing.id !== listingId));
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete unit listing.");
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Home &gt; Unit Listings</p>
          <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">Unit Listings</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">Manage your vacation rental units.</p>
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

      <UnitListingFilters
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
      />

      {loading ? <Loading label="Loading unit listings..." /> : null}

      {!loading && error ? (
        <ErrorMsg title="Unable to load unit listings." message={error} onRetry={loadListings} />
      ) : null}

      {!loading && !error && filteredListings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-plum-800">No unit listings found.</h2>
          <p className="mt-2 text-sm text-slate-500">Add a unit or broaden your search filters.</p>
        </div>
      ) : null}

      {!loading && !error && filteredListings.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredListings.map((listing) => (
            <UnitListingCard
              key={listing.id}
              listing={listing}
              onView={() => navigate(`/unit-listings/${listing.id}`)}
              onEdit={() => navigate(`/unit-listings/${listing.id}/edit`)}
              onDelete={() => handleDelete(listing.id)}
              deleting={deletingId === listing.id}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default UnitListingsPage;
