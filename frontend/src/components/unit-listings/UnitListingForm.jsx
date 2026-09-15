import { useEffect, useMemo, useState } from "react";

const EMPTY_FORM = {
  name: "",
  description: "",
  location: "",
  nightly_rate: "",
  status: "active",
  amenities: "",
  check_in_time: "",
  check_out_time: "",
  property_id: "",
  listing_documents: [],
};

function normalizeInitialValues(initialValues) {
  return {
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    location: initialValues?.location ?? "",
    nightly_rate:
      initialValues?.nightly_rate !== undefined &&
      initialValues?.nightly_rate !== null
        ? String(initialValues.nightly_rate)
        : "",
    status: initialValues?.status ?? "active",
    amenities: Array.isArray(initialValues?.amenities)
      ? initialValues.amenities.join(", ")
      : "",
    check_in_time: initialValues?.check_in_time ?? "",
    check_out_time: initialValues?.check_out_time ?? "",
    property_id: initialValues?.property_id ?? "",
    listing_documents: Array.isArray(initialValues?.listing_documents)
      ? initialValues.listing_documents
      : [],
  };
}

function UnitListingForm({
  initialValues,
  submitLabel = "Save",
  loading = false,
  error = "",
  onCancel,
  backTo,
  onSubmit,
}) {
  const mergedInitialValues = useMemo(
    () => normalizeInitialValues(initialValues),
    [initialValues],
  );

  const [formData, setFormData] = useState(
    initialValues ? mergedInitialValues : EMPTY_FORM,
  );

  const [fieldErrors, setFieldErrors] = useState({});

  /*
   * Important for edit mode:
   * The page initially renders before the API request finishes.
   * Once initialValues arrives, synchronize the form with the
   * actual listing returned by the backend.
   */
  useEffect(() => {
    if (initialValues) {
      setFormData(mergedInitialValues);
      setFieldErrors({});
    }
  }, [initialValues, mergedInitialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }

    if (formData.nightly_rate === "") {
      errors.nightly_rate = "Nightly rate is required.";
    } else if (
      Number.isNaN(Number(formData.nightly_rate)) ||
      Number(formData.nightly_rate) < 0
    ) {
      errors.nightly_rate = "Enter a valid nightly rate.";
    }

    if (
      formData.status &&
      !["active", "inactive", "draft"].includes(formData.status)
    ) {
      errors.status = "Invalid status.";
    }

    if (formData.property_id.trim()) {
      const uuidPattern =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

      if (!uuidPattern.test(formData.property_id.trim())) {
        errors.property_id = "Property ID must be a valid UUID.";
      }
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!validate()) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      location: formData.location.trim() || null,
      nightly_rate: Number(formData.nightly_rate),
      status: formData.status,
      amenities: formData.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      check_in_time: formData.check_in_time.trim() || null,
      check_out_time: formData.check_out_time.trim() || null,
      property_id: formData.property_id.trim() || null,
      listing_documents: formData.listing_documents,
    };

    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      <div className="rounded-3xl border border-cream-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-semibold text-plum-800">
            Listing Details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add the basic information for this unit.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Unit Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                fieldErrors.name
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-cream-200 focus:border-plum-500 focus:ring-plum-100"
              }`}
              placeholder="Deluxe Garden Room"
            />

            {fieldErrors.name ? (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-100"
              placeholder="Describe the room or unit..."
            />
          </div>

          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-100"
              placeholder="Ground Floor"
            />
          </div>

          <div>
            <label
              htmlFor="nightly_rate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Nightly Rate
            </label>

            <input
              id="nightly_rate"
              name="nightly_rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.nightly_rate}
              onChange={handleChange}
              disabled={loading}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                fieldErrors.nightly_rate
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-cream-200 focus:border-plum-500 focus:ring-plum-100"
              }`}
              placeholder="2500"
            />

            {fieldErrors.nightly_rate ? (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.nightly_rate}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-100 ${
                fieldErrors.status
                  ? "border-red-300"
                  : "border-cream-200"
              }`}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>

            {fieldErrors.status ? (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.status}
              </p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="property_id"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Property ID
            </label>

            <input
              id="property_id"
              name="property_id"
              type="text"
              value={formData.property_id}
              onChange={handleChange}
              disabled={loading}
              className={`w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 ${
                fieldErrors.property_id
                  ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                  : "border-cream-200 focus:border-plum-500 focus:ring-plum-100"
              }`}
              placeholder="Property UUID"
            />

            {fieldErrors.property_id ? (
              <p className="mt-1 text-sm text-red-600">
                {fieldErrors.property_id}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="amenities"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Amenities
            </label>

            <input
              id="amenities"
              name="amenities"
              type="text"
              value={formData.amenities}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-100"
              placeholder="WiFi, AC, TV, Breakfast"
            />

            <p className="mt-1 text-xs text-slate-500">
              Separate amenities with commas.
            </p>
          </div>

          <div>
            <label
              htmlFor="check_in_time"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Check-in Time
            </label>

            <input
              id="check_in_time"
              name="check_in_time"
              type="time"
              value={formData.check_in_time}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-100"
            />
          </div>

          <div>
            <label
              htmlFor="check_out_time"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Check-out Time
            </label>

            <input
              id="check_out_time"
              name="check_out_time"
              type="time"
              value={formData.check_out_time}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-100"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={backTo || onCancel}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 bg-white px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Back
        </button>

        <div className="flex flex-col-reverse gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl border border-cream-200 bg-white px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}

export default UnitListingForm;