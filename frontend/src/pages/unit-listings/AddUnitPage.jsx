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
      const created = await createUnitListing(payload);
      navigate("/unit-listings", {
        replace: true,
        state: { flash: `Unit "${created?.name || "listing"}" was created successfully.` },
      });
    } catch (submitError) {
      setError(submitError.message || "Unable to create unit listing.");
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate("/unit-listings")}
            className="hover:text-plum-800"
          >
            Unit Listings
          </button>{" "}
          &gt; Add Unit
        </p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          Add New Unit
        </h1>
        <p className="text-sm text-slate-500">List your property and provide details.</p>
      </div>

      <UnitListingForm
        submitLabel="Create Unit"
        loading={loading}
        error={error}
        onCancel={() => navigate("/unit-listings")}
        backTo={() => navigate("/unit-listings")}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default AddUnitPage;
