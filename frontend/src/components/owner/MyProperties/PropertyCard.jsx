import React from "react";
import {
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  MoreHorizontal,
} from "lucide-react";

function PropertyCard({
  name,
  location,
  image,
  status,
  occupancy,
  revenue,
  bookings,
  beds,
  baths,
  sqft,
}) {
  const isActive = status === "Active";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">

      {/* Property Image */}
      <div className="relative h-[145px] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />

        {/* Status */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-medium ${
            isActive
              ? "bg-emerald-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">

        {/* Name + More */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-serif text-lg font-semibold text-[#54213f]">
              {name}
            </h3>

            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <MapPin size={13} />
              <span>{location}</span>
            </div>
          </div>

          <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-[#54213f]">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Performance Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2">

          <div className="rounded-lg bg-[#faf7f8] px-2 py-2 text-center">
            <p className="text-sm font-semibold text-[#54213f]">
              {occupancy}%
            </p>
            <p className="mt-1 text-[9px] text-gray-500">
              Occupancy
            </p>
          </div>

          <div className="rounded-lg bg-[#faf7f8] px-2 py-2 text-center">
            <p className="text-sm font-semibold text-[#54213f]">
              {revenue}
            </p>
            <p className="mt-1 text-[9px] text-gray-500">
              Monthly Revenue
            </p>
          </div>

          <div className="rounded-lg bg-[#faf7f8] px-2 py-2 text-center">
            <p className="text-sm font-semibold text-[#54213f]">
              {bookings}
            </p>
            <p className="mt-1 text-[9px] text-gray-500">
              Upcoming Bookings
            </p>
          </div>

        </div>

        {/* Property Details */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">

          <div className="flex items-center gap-1">
            <BedDouble size={15} />
            <span>{beds} Beds</span>
          </div>

          <div className="flex items-center gap-1">
            <Bath size={15} />
            <span>{baths} Baths</span>
          </div>

          <div className="flex items-center gap-1">
            <Maximize size={14} />
            <span>{sqft} sq ft</span>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">

          <button className="h-9 rounded-md border border-[#9b5475] bg-white text-xs font-medium text-[#54213f] transition hover:bg-[#faf1f5]">
            View Details
          </button>

          <button className="h-9 rounded-md bg-[#681744] text-xs font-medium text-white transition hover:bg-[#54213f]">
            Manage
          </button>

        </div>
      </div>
    </div>
  );
}

export default PropertyCard;