import {
  Search,
  Bell,
  ChevronDown,
  Menu,
  User,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { formatDate } from "../../utils/format";

const TopNavbar = ({ onMenuClick }) => {
  const location = useLocation();
  const isGuestMode = location.pathname.startsWith("/guest");

  return (
    <header className="sticky top-0 z-30 h-[72px] shrink-0 border-b border-cream-200 bg-white">
      <div className="flex h-full min-w-0 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Mobile / tablet brand + menu (visible below lg) */}
        <div className="flex min-w-0 items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cream-200 text-plum-800"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <p className="truncate font-serif text-base font-semibold text-plum-800">
              Meridian Stays
            </p>
            <p className="text-[11px] text-slate-500">{formatDate(new Date())}</p>
          </div>
        </div>

        {/* Search Bar (desktop) */}
        <div className="relative hidden w-[310px] lg:block">
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
              bg-cream-50
              pl-11
              pr-4
              text-[13px]
              text-plum-800
              outline-none
              placeholder:text-[#a99ca3]
              focus:bg-white
              focus:ring-2
              focus:ring-plum-500/10
            "
          />
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-6">

          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-plum-800
              hover:bg-cream-100
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
              hover:bg-cream-50
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
                bg-cream-100
                text-plum-800
              "
            >
              {isGuestMode ? <User size={18} /> : <span className="font-serif text-[15px] font-medium">PS</span>}
            </div>

            {/* Name & Role */}
            <div className="hidden flex-col items-start sm:flex">
              <span className="text-[13px] font-semibold text-plum-800">
                {isGuestMode ? "Guest" : "Priyam Sharma"}
              </span>

              <span className="mt-1 text-[10px] text-[#96858e]">
                {isGuestMode ? "Traveler" : "Owner"}
              </span>
            </div>

            {/* Dropdown */}
            <ChevronDown
              size={16}
              strokeWidth={1.7}
              className="ml-1 text-plum-800"
            />

          </button>

        </div>

      </div>
    </header>
  );
};

export default TopNavbar;