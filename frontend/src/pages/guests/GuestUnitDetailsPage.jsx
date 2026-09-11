import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (listing) return;

    const loadListing = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getUnitListing(unitId);
        setListing(data);
      } catch (loadError) {
        setError(loadError.message || "Unable to load this listing.");
      } finally {
        setLoading(false);
      }
    };

    loadListing();
  }, [listing, unitId]);

  if (loading) return <Loading label="Loading property details..." />;
  if (error && !listing) return <ErrorMsg title="Unable to load property details." message={error} />;

  return <UnitListingDetails listing={listing} onBook={() => navigate(`/guest/book/${unitId}`, { state: { listing } })} />;
}

export default GuestUnitDetailsPage;