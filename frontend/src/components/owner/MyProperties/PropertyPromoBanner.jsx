import React from "react";
import { House, Plus } from "lucide-react";

function PropertyPromoBanner() {
  return (
    <div className="mt-5 overflow-hidden rounded-xl bg-gradient-to-r from-[#f7e7ed] to-[#fdf7f9]">
      <div className="flex items-center justify-between px-5 py-5">

        <div className="flex items-center gap-4">
          {/* Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ead0dc]">
            <House size={21} className="text-[#54213f]" />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-sm font-semibold text-[#54213f]">
              Have another property to list?
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Expand your reach and earn more with Meridian Stays.
            </p>
          </div>
        </div>

        {/* Button */}
        <button className="flex items-center gap-2 rounded-lg bg-[#681744] px-5 py-3 text-xs font-medium text-white transition hover:bg-[#54213f]">
          <Plus size={15} />
          Add New Property
        </button>

      </div>
    </div>
  );
}

export default PropertyPromoBanner;