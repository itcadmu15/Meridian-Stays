import { ArrowRight, MapPin } from "lucide-react";
import { formatCurrency } from "../../utils/format";

const cardImages = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=900&q=80",
];

function FeaturedPropertyCard({ listing, onClick }) {
  const imageIndex = Math.abs(
    (listing?.id || listing?.name || "stay")
      .toString()
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0)
  ) % cardImages.length;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-[24px] border border-cream-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Property imagery with rate badge */}
      <div className="relative h-48 w-full overflow-hidden bg-cream-100">
        <img
          src={cardImages[imageIndex]}
          alt={listing?.name || "Featured property"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/45 via-transparent to-transparent" />

        <span className="absolute bottom-3 left-4 rounded-full bg-white/95 px-3 py-1.5 text-sm font-semibold text-plum-800 shadow-sm">
          {formatCurrency(listing?.nightly_rate)}
          <span className="ml-1 text-[11px] font-normal text-slate-500">/ night</span>
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div>
          <h3 className="font-serif text-xl font-semibold leading-snug text-plum-800">
            {listing?.name}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={15} className="shrink-0 text-plum-500" />
            <span className="truncate">{listing?.location || "Location not provided"}</span>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-slate-600">
          {listing?.description || "Beautiful hospitality space."}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-cream-100 pt-4">
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
            {listing?.status === "draft" ? "Coming soon" : "Available"}
          </span>

          <span className="inline-flex items-center gap-2 rounded-full bg-cream-100 px-3 py-2 text-sm font-medium text-plum-800 transition group-hover:bg-plum-800 group-hover:text-white">
            View
            <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </button>
  );
}

export default FeaturedPropertyCard;