import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UnitListingForm from "../../components/unit-listings/UnitListingForm";
import { createUnitListing } from "../../services/unitListingService";

function AddUnitPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError("");

    try {
      await createUnitListing(payload);
      navigate("/unit-listings", { replace: true });
    } catch (submitError) {
      setError(submitError.message || "Unable to create unit listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Unit Listings &gt; Add Unit</p>
        <h1 className="font-serif text-4xl font-semibold text-plum-800">Add New Unit</h1>
        <p className="text-sm text-slate-500">List your property and provide details.</p>
      </div>

      <UnitListingForm
        submitLabel="Create Unit"
        loading={loading}
        error={error}
        onCancel={() => navigate("/unit-listings")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default AddUnitPage;