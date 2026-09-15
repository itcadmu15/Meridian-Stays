import React from "react";
import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

function TopNavbar({ owner }) {
  // Show a loading version until owner data is available
  if (!owner) {
    return (
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#eadde3] bg-white px-6">
        
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-200 bg-[#faf7f8] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#d9bdca]"
          />
        </div>

        {/* Loading owner */}
        <div className="ml-6 flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-full bg-[#f2dce6]" />

          <div className="hidden sm:block">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-2 w-12 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </header>
    );
  }

  // Generate initials from owner name
  const initials = owner.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#eadde3] bg-white px-6">

      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-gray-200 bg-[#faf7f8] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#d9bdca]"
        />
      </div>

      {/* Right section */}
      <div className="ml-6 flex items-center gap-5">

        {/* Notification */}
        <button
          type="button"
          className="relative text-[#54213f] transition hover:text-[#681744]"
        >
          <Bell
            size={20}
            strokeWidth={1.7}
          />

          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#b73862]" />
        </button>

        {/* Owner */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f2dce6] text-sm font-medium text-[#713653]">
            {initials}
          </div>

          {/* Name + Role */}
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#54213f]">
              {owner.name}
            </p>

            <p className="text-[10px] text-gray-400">
              Owner
            </p>
          </div>

          <ChevronDown
            size={16}
            className="text-[#54213f]"
          />
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;