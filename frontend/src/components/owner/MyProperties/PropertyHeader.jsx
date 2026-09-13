import React from "react";
import { Plus, Search } from "lucide-react";

function PropertyHeader() {
  return (
    <div className="mb-5">
      {/* Breadcrumb */}
      <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <span>/</span>
        <span className="font-medium text-[#54213f]">
          My Properties
        </span>
      </div>

      {/* Heading */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-[#54213f]">
            My Properties
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your vacation rentals, view performance and keep track
            of your listings.
          </p>
        </div>

        {/* Decorative text */}
        <div className="hidden text-right md:block">
          <p className="font-serif text-xl italic text-[#9b5475]">
            Beautiful
          </p>
          <p className="font-serif text-xl italic text-[#9b5475]">
            Places,
          </p>
          <p className="font-serif text-xl italic text-[#9b5475]">
            Happier People
          </p>
        </div>
      </div>
    </div>
  );
}

export default PropertyHeader;