import { useMemo, useState } from "react";
import { AlertCircle, ArrowRight, CalendarDays, MapPin, Pencil, Sparkles } from "lucide-react";

const defaultValues = {
  name: "",
  description: "",
  location: "",
  nightly_rate: "",
  status: "active",
  amenities: "",
  check_in_time: "14:00",
  check_out_time: "11:00",
  listing_documents: "",
  property_id: "",
};

function formatDocuments(documents) {
  if (!Array.isArray(documents) || documents.length === 0) return "";

  return documents
    .map((document) => {
      if (typeof document === "string") return document;
      if (document && typeof document === "object") {
        return document.name || document.title || document.url || JSON.stringify(document);
      }
      return "";
    })
    .filter(Boolean)
    .join("\n");
}

function UnitListingForm({ initialValues, submitLabel, onSubmit, onCancel, loading = false, error }) {
  const mergedInitialValues = useMemo(
    () => ({
      ...defaultValues,
      ...initialValues,
      nightly_rate:
        initialValues?.nightly_rate !== undefined && initialValues?.nightly_rate !== null
          ? String(initialValues.nightly_rate)
          : "",
      amenities: Array.isArray(initialValues?.amenities)
        ? initialValues.amenities.join(", ")
        : initialValues?.amenities || "",
      listing_documents: formatDocuments(initialValues?.listing_documents),
      property_id: initialValues?.property_id || "",
    }),
    [initialValues],
  );

  const [formData, setFormData] = useState(mergedInitialValues);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Property name is required.";
    }

    const nightlyRateValue = Number(formData.nightly_rate);
    if (!formData.nightly_rate && formData.nightly_rate !== 0) {
      errors.nightly_rate = "Nightly rate is required.";
    } else if (Number.isNaN(nightlyRateValue) || nightlyRateValue < 0) {
      errors.nightly_rate = "Nightly rate must be zero or greater.";
    }

    if (!formData.status) {
      errors.status = "Status is required.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) return;

    const amenities = formData.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const listingDocuments = formData.listing_documents
      .split(/\n+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => ({ name: item }));

    await onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      location: formData.location.trim() || null,
      nightly_rate: Number(formData.nightly_rate),
      status: formData.status,
      amenities,
      check_in_time: formData.check_in_time || null,
      check_out_time: formData.check_out_time || null,
      listing_documents: listingDocuments,
      property_id: formData.property_id.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-cream-200 bg-white p-5 shadow-sm">
        <p className="font-serif text-lg font-semibold text-plum-800">Steps</p>
        <div className="mt-5 space-y-2">
          {[
            "Basic Information",
            "Location",
            "Amenities",
            "Pricing & Availability",
            "Photos",
            "Documents",
          ].map((step, index) => (
            <div
              key={step}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm ${index === 0 ? "bg-cream-100 text-plum-800" : "text-slate-500"}`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-plum-800 shadow-sm">
                {index + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-cream-50 p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2 font-medium text-plum-800">
            <Sparkles size={16} />
            Backend contract
          </div>
          <p className="mt-2 leading-6">
            This form submits only the fields supported by the existing FastAPI unit listing API.
          </p>
        </div>
      </aside>

      <div className="min-w-0 rounded-3xl border border-cream-200 bg-white p-5 shadow-sm md:p-8">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-cream-100 text-plum-800">
            <Pencil size={20} />
          </div>

          <div>
            <p className="font-serif text-2xl font-semibold text-plum-800">Basic Information</p>
            <p className="mt-1 text-sm text-slate-500">List your property and provide details.</p>
          </div>
        </div>

        {error ? (
          <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-start gap-2 font-medium">
              <AlertCircle size={16} />
              {error}
            </div>
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-plum-800">Property Name *</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Deluxe Garden Room"
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />
            {fieldErrors.name ? <p className="text-xs text-red-600">{fieldErrors.name}</p> : null}
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-plum-800">Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Comfortable room with garden view"
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-plum-800">Location</span>
            <div className="relative">
              <MapPin size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Ground Floor"
                className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 pl-10 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
              />
            </div>
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-plum-800">Nightly Rate *</span>
            <div className="relative">
              <CalendarDays size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="nightly_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.nightly_rate}
                onChange={handleChange}
                placeholder="2500"
                className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 pl-10 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
              />
            </div>
            {fieldErrors.nightly_rate ? <p className="text-xs text-red-600">{fieldErrors.nightly_rate}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-plum-800">Status</span>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
            </select>
            {fieldErrors.status ? <p className="text-xs text-red-600">{fieldErrors.status}</p> : null}
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-plum-800">Amenities</span>
            <textarea
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              rows={3}
              placeholder="WiFi, AC, TV, Breakfast"
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-plum-800">Check-in Time</span>
            <input
              name="check_in_time"
              type="time"
              value={formData.check_in_time}
              onChange={handleChange}
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-plum-800">Check-out Time</span>
            <input
              name="check_out_time"
              type="time"
              value={formData.check_out_time}
              onChange={handleChange}
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-plum-800">Listing Documents</span>
            <textarea
              name="listing_documents"
              value={formData.listing_documents}
              onChange={handleChange}
              rows={3}
              placeholder="One document per line"
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />
          </label>

          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-plum-800">Property ID</span>
            <input
              name="property_id"
              value={formData.property_id}
              onChange={handleChange}
              placeholder="Optional backend property identifier"
              className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-cream-100 pt-5 sm:flex-row sm:items-center sm:justify-end">
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center justify-center rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
            >
              Cancel
            </button>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Saving..." : submitLabel}
            {!loading ? <ArrowRight size={16} /> : null}
          </button>
        </div>
      </div>
    </form>
  );
}

export default UnitListingForm;