import React from "react";
import {
  Bell,
  ChevronDown,
} from "lucide-react";

function TopNavbar({ owner }) {
  const initials = owner.name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#eadde3] bg-white px-6">
      
      {/* Left side / Search */}
      <div className="flex items-center">
        {/* Keep your existing search bar here */}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button
          type="button"
          className="relative text-[#54213f] transition hover:text-[#681744]"
        >
          <Bell size={20} strokeWidth={1.7} />

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