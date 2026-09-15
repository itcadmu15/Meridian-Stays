import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import UnitListingDetails from "../../components/unit-listings/UnitListingDetails";
import {
  deleteUnitListing,
  getUnitListing,
} from "../../services/unitListingService";

function UnitDetailsPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadListing = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getUnitListing(unitId);
      setListing(data);
    } catch (loadError) {
      setError(loadError.message || "Unable to load this unit listing.");
    } finally {
      setLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadListing();
  }, [loadListing]);

  const handleDelete = async () => {
    setDeleting(true);

    try {
      await deleteUnitListing(unitId);
      navigate("/unit-listings", {
        replace: true,
        state: { flash: `Unit "${listing?.name || "listing"}" was deleted.` },
      });
    } catch (deleteError) {
      setError(deleteError.message || "Unable to delete unit listing.");
      setConfirmOpen(false);
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loading label="Loading unit details..." />;
  }

  if (error && !listing) {
    return (
      <ErrorMsg title="Unable to load unit details." message={error} onRetry={loadListing} />
    );
  }

  return (
    <>
      <UnitListingDetails
        listing={listing}
        ownerView
        onEdit={() => navigate(`/unit-listings/${unitId}/edit`)}
        onDelete={() => setConfirmOpen(true)}
        onBack={() => navigate("/unit-listings")}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this unit listing?"
        message={`"${
          listing?.name || "This unit"
        }" will be permanently removed from Meridian Stays. This cannot be undone.`}
        confirmLabel="Delete unit"
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

export default UnitDetailsPage;
