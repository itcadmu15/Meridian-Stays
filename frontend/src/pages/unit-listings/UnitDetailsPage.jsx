import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import UnitListingDetails from "../../components/unit-listings/UnitListingDetails";
import { getUnitListing } from "../../services/unitListingService";

function UnitDetailsPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadListing();
  }, [loadListing]);

  if (loading) {
    return <Loading label="Loading unit details..." />;
  }

  if (error && !listing) {
    return <ErrorMsg title="Unable to load unit details." message={error} onRetry={loadListing} />;
  }

  return (
    <UnitListingDetails
      listing={listing}
      onEdit={() => navigate(`/unit-listings/${unitId}/edit`)}
      onBook={() => navigate(`/guest/book/${unitId}`, { state: { listing } })}
    />
  );
}

export default UnitDetailsPage;