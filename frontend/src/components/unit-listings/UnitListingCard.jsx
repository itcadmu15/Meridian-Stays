import { ArrowRight, Edit3, MapPin, Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/format";

const cardImages = [
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
];

function getStatusStyle(status) {
  if (status === "inactive") {
    return "bg-slate-100 text-slate-600";
  }

  if (status === "draft") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-[#f7e1e3] text-[#54213f]";
}

function UnitListingCard({ listing, onView, onEdit, onDelete, deleting = false }) {
  const amenities = Array.isArray(listing?.amenities) ? listing.amenities : [];

  const imageIndex = Math.abs(
    (listing?.id || listing?.name || "unit")
      .toString()
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0)
  ) % cardImages.length;

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[24px] border border-cream-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {/* Property imagery with status badge */}
      <div className="relative h-44 w-full overflow-hidden bg-cream-100 sm:h-48">
        <img
          src={cardImages[imageIndex]}
          alt={listing?.name || "Unit listing"}
          loading="lazy"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/40 via-transparent to-transparent" />

        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium shadow-sm ${getStatusStyle(listing?.status)}`}>
          {listing?.status || "draft"}
        </span>

        <span className="absolute bottom-3 left-4 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-plum-800 shadow-sm">
          {formatCurrency(listing?.nightly_rate)}
          <span className="ml-1 text-[11px] font-normal text-slate-500">/ night</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div>
          <h3 className="font-serif text-xl font-semibold text-plum-800 sm:text-2xl">{listing?.name}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={15} className="shrink-0 text-plum-500" />
            <span className="break-words">{listing?.location || "Location not provided"}</span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {listing?.description || "No description available for this unit."}
        </p>

        {amenities.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="rounded-full bg-cream-50 px-3 py-1.5 text-xs text-slate-600">
                {amenity}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-auto flex flex-col gap-2 border-t border-cream-100 pt-4 sm:flex-row sm:flex-wrap">
          {onView ? (
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-plum-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-plum-700"
            >
              View
              <ArrowRight size={15} />
            </button>
          ) : null}

          {onEdit ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 px-4 py-2.5 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
            >
              <Edit3 size={15} />
              Edit
            </button>
          ) : null}

          {onDelete ? (
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-100 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 size={15} />
              {deleting ? "Deleting..." : "Delete"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default UnitListingCard;