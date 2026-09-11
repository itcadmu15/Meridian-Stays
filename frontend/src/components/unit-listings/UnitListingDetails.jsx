import { useState } from "react";
import { CalendarDays, Clock3, FileText, MapPin, Star, Tag } from "lucide-react";

// NOTE: icons are used in the info panel below the hero (MapPin, Clock3, Star)
import { formatCurrency } from "../../utils/format";

const heroImages = [
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=80",
];

function UnitListingDetails({ listing, onBook, onEdit }) {
  const [activeTab, setActiveTab] = useState("overview");

  const amenities = Array.isArray(listing?.amenities) ? listing.amenities : [];
  const documents = Array.isArray(listing?.listing_documents) ? listing.listing_documents : [];

  const heroImage = heroImages[
    Math.abs(
      (listing?.id || listing?.name || "unit")
        .toString()
        .split("")
        .reduce((total, char) => total + char.charCodeAt(0), 0)
    ) % heroImages.length
  ];

  const documentLabel = (document, index) => {
    if (typeof document === "string") return document;
    if (document && typeof document === "object") {
      return document.name || document.title || document.url || `Document ${index + 1}`;
    }
    return `Document ${index + 1}`;
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-cream-200 bg-plum-900 shadow-sm">
        <div className="relative min-h-[340px] sm:min-h-[380px]">
          {/* Property imagery */}
          <img
            src={heroImage}
            alt={listing?.name || "Unit listing"}
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Plum scrim so white text is always readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-plum-950/90 via-plum-900/60 to-plum-950/25" />

          <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-between gap-8 px-5 py-7 text-white sm:px-8 sm:py-8 md:px-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white backdrop-blur-sm">
                  <Tag size={12} />
                  {listing?.status || "draft"}
                </span>

                <h1 className="mt-4 break-words font-serif text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
                  {listing?.name}
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/90 sm:text-base">
                  {listing?.description || "No description available for this unit listing."}
                </p>
              </div>

              <div className="shrink-0 rounded-3xl bg-white/15 px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.25em] text-white/80">Nightly rate</p>
                <p className="mt-1 font-serif text-2xl font-semibold sm:text-3xl">{formatCurrency(listing?.nightly_rate)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {onBook ? (
                <button
                  type="button"
                  onClick={onBook}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-plum-800 transition hover:bg-cream-50"
                >
                  <CalendarDays size={16} />
                  Book Now
                </button>
              ) : null}

              {onEdit ? (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  Edit Listing
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Info panel: location, times, rate */}
      <section className="grid gap-4 rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:grid-cols-3 md:p-6">
        <div className="rounded-3xl bg-cream-50 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Location</p>
          <div className="mt-2 flex items-start gap-3 text-slate-700">
            <MapPin size={18} className="mt-0.5 shrink-0 text-plum-800" />
            <p className="break-words font-medium">{listing?.location || "Location not provided"}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:col-span-2">
          <div className="rounded-3xl border border-cream-100 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Check-in</p>
            <div className="mt-2 flex items-center gap-2 text-plum-800">
              <Clock3 size={16} />
              <span className="font-medium">{listing?.check_in_time || "Not set"}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-cream-100 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Check-out</p>
            <div className="mt-2 flex items-center gap-2 text-plum-800">
              <Clock3 size={16} />
              <span className="font-medium">{listing?.check_out_time || "Not set"}</span>
            </div>
          </div>

          <div className="rounded-3xl border border-cream-100 p-4 sm:col-span-2">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Nightly rate</p>
            <p className="mt-2 flex items-center gap-2 font-serif text-2xl font-semibold text-plum-800">
              {formatCurrency(listing?.nightly_rate)}
            </p>

            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-cream-50 px-4 py-3 text-sm text-slate-600">
              <Star size={16} className="shrink-0 text-plum-500" />
              Premium hospitality experience
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap gap-2 border-b border-cream-100 pb-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "amenities", label: "Amenities" },
            { id: "location", label: "Location" },
            { id: "availability", label: "Availability" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${activeTab === tab.id ? "bg-plum-800 text-white" : "bg-cream-50 text-slate-600 hover:bg-cream-100"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="pt-5">
          {activeTab === "overview" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-cream-50 p-5">
                <p className="text-sm font-semibold text-plum-800">Description</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {listing?.description || "No description available."}
                </p>
              </div>

              <div className="rounded-3xl bg-cream-50 p-5">
                <p className="text-sm font-semibold text-plum-800">Summary</p>
                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between"><span>Status</span><span className="font-medium text-plum-800">{listing?.status || "draft"}</span></div>
                  <div className="flex items-center justify-between"><span>Nightly rate</span><span className="font-medium text-plum-800">{formatCurrency(listing?.nightly_rate)}</span></div>
                  <div className="flex items-center justify-between"><span>Property ID</span><span className="break-all font-medium text-plum-800">{listing?.property_id || "Not linked"}</span></div>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === "amenities" ? (
            amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <span key={amenity} className="rounded-full bg-cream-100 px-3 py-2 text-sm text-plum-800">
                    {amenity}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No amenities have been added yet.</p>
            )
          ) : null}

          {activeTab === "location" ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="rounded-3xl bg-cream-50 p-5">
                <p className="text-sm font-semibold text-plum-800">Location details</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {listing?.location || "Location has not been provided."}
                </p>
              </div>
              <div className="rounded-3xl border border-dashed border-rose-300 bg-white p-5 text-sm text-slate-500">
                Map preview placeholder
              </div>
            </div>
          ) : null}

          {activeTab === "availability" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-cream-50 p-5">
                <p className="text-sm font-semibold text-plum-800">Check-in</p>
                <p className="mt-2 text-sm text-slate-600">{listing?.check_in_time || "Not set"}</p>
              </div>
              <div className="rounded-3xl bg-cream-50 p-5">
                <p className="text-sm font-semibold text-plum-800">Check-out</p>
                <p className="mt-2 text-sm text-slate-600">{listing?.check_out_time || "Not set"}</p>
              </div>

              <div className="rounded-3xl border border-dashed border-rose-300 bg-white p-5 text-sm text-slate-500 md:col-span-2">
                Availability calendar placeholder. The backend currently exposes listing data only, so this panel is intentionally informational.
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {documents.length > 0 ? (
        <section className="rounded-[28px] border border-cream-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex items-center gap-2 text-plum-800">
            <FileText size={18} />
            <h2 className="font-serif text-2xl font-semibold">Documents</h2>
          </div>

          <div className="mt-4 space-y-3">
            {documents.map((document, index) => (
              <div key={`${documentLabel(document, index)}-${index}`} className="break-words rounded-2xl bg-cream-50 px-4 py-3 text-sm text-slate-600">
                {documentLabel(document, index)}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

export default UnitListingDetails;