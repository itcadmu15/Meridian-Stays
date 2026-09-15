import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import UnitListingDetails from "../../components/unit-listings/UnitListingDetails";
import { getUnitListing } from "../../services/unitListingService";

function GuestUnitDetailsPage() {
  const { unitId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [listing, setListing] = useState(location.state?.listing || null);
  const [loading, setLoading] = useState(!location.state?.listing);
  const [error, setError] = useState("");

  // Always re-fetch in the background so the detail page reflects live data even
  // when arriving with a pre-filled listing from the grid.
  const loadListing = useCallback(async () => {
    setError("");

    try {
      const data = await getUnitListing(unitId);
      setListing(data);
    } catch (loadError) {
      if (!location.state?.listing) {
        setError(loadError.message || "Unable to load this listing.");
      }
    } finally {
      setLoading(false);
    }
  }, [unitId, location.state?.listing]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadListing();
  }, [loadListing]);

  if (loading && !listing) return <Loading label="Loading property details..." />;
  if (error && !listing)
    return <ErrorMsg title="Unable to load property details." message={error} />;

  return (
    <UnitListingDetails
      listing={listing}
      onBack={() => navigate("/guest")}
      onBook={() => navigate(`/guest/book/${unitId}`, { state: { listing } })}
    />
  );
}

export default GuestUnitDetailsPage;
