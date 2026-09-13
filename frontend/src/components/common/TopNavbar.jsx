import React from "react";
import {
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

const TopNavbar = () => {
  return (
    <header className="h-[72px] border-b border-[#eadfe4] bg-[#fffdfd]">
      <div className="flex h-full items-center justify-between px-7">

        {/* Search Bar */}
        <div className="relative w-[310px]">
          <Search
            size={18}
            strokeWidth={1.7}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9d8b95]"
          />

          <input
            type="text"
            placeholder="Search anything..."
            className="
              h-[40px]
              w-full
              rounded-xl
              bg-[#f4eef1]
              pl-11
              pr-4
              text-[13px]
              text-[#54213f]
              outline-none
              placeholder:text-[#a99ca3]
              focus:bg-white
              focus:ring-2
              focus:ring-[#8b4a6b]/10
            "
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">

          {/* Notification */}
          <button
            type="button"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-[#54213f]
              hover:bg-[#f6eef2]
            "
          >
            <Bell
              size={20}
              strokeWidth={1.7}
            />

            {/* Notification Dot */}
            <span
              className="
                absolute
                right-[9px]
                top-[7px]
                h-[7px]
                w-[7px]
                rounded-full
                bg-[#b43d55]
                ring-2
                ring-white
              "
            />
          </button>

          {/* User */}
          <button
            type="button"
            className="
              flex
              items-center
              gap-3
              rounded-lg
              px-2
              py-1.5
              hover:bg-[#f8f2f4]
            "
          >

            {/* Avatar */}
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#ead4dc]
                text-[#54213f]
              "
            >
              <span className="font-serif text-[15px] font-medium">
                PS
              </span>
            </div>

            {/* Name & Role */}
            <div className="flex flex-col items-start">
              <span className="text-[13px] font-semibold text-[#54213f]">
                Priyam Sharma
              </span>

              <span className="mt-1 text-[10px] text-[#96858e]">
                Owner
              </span>
            </div>

            {/* Dropdown */}
            <ChevronDown
              size={16}
              strokeWidth={1.7}
              className="ml-1 text-[#54213f]"
            />

          </button>

        </div>

      </div>
    </header>
  );
};

export default TopNavbar;