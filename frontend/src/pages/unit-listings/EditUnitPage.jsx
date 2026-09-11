import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import UnitListingForm from "../../components/unit-listings/UnitListingForm";
import { getUnitListing, updateUnitListing } from "../../services/unitListingService";

function EditUnitPage() {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (payload) => {
    setSaving(true);
    setError("");

    try {
      await updateUnitListing(unitId, payload);
      navigate(`/unit-listings/${unitId}`);
    } catch (submitError) {
      setError(submitError.message || "Unable to update unit listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading label="Loading listing details..." />;
  }

  if (error && !listing) {
    return <ErrorMsg title="Unable to load this listing." message={error} onRetry={loadListing} />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Unit Listings &gt; Edit Unit</p>
        <h1 className="font-serif text-4xl font-semibold text-plum-800">Edit Unit</h1>
        <p className="text-sm text-slate-500">Update pricing, availability, and listing details.</p>
      </div>

      <UnitListingForm
        initialValues={listing}
        submitLabel="Save Changes"
        loading={saving}
        error={error}
        onCancel={() => navigate(`/unit-listings/${unitId}`)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EditUnitPage;