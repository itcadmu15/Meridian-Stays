import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  User,
  UserRound,
} from "lucide-react";
import { formatDate } from "../../utils/format";
import { getSessionUser, logout } from "../../services/authService";
import { getUnitListings } from "../../services/unitListingService";

const AREA_LABELS = {
  owner: "Owner",
  staff: "Staff",
  guest: "Guest",
};

function TopNavbar({ area = "owner", onMenuClick }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);
  const searchTimer = useRef(null);

  const sessionUser = getSessionUser();

  const displayName = sessionUser?.name || "Meridian User";
  const areaLabel = AREA_LABELS[area] || "Member";

  const avatarInitials = (displayName || "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const loginPath = area === "guest" ? "/guest/login" : "/owner/login";
  const profilePath = area === "guest" ? "/guest/profile" : "/owner/account";

  // Notifications are not provided by the backend, so the panel is an honest
  // empty state rather than fake alerts.
  const notifications = useMemo(() => [], []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset UI state on navigation
    setProfileOpen(false);
    setNotificationsOpen(false);
    setQuery("");
    setSearchResults([]);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setProfileOpen(false);
    logout();
    navigate(loginPath, { replace: true });
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setQuery(value);

    if (searchTimer.current) clearTimeout(searchTimer.current);

    if (!value.trim() || area === "staff") {
      setSearchResults([]);
      return;
    }

    // Context-aware search over real data: owner searches units, guest
    // searches bookable listings.
    searchTimer.current = setTimeout(async () => {
      try {
        const listings = await getUnitListings();
        const term = value.trim().toLowerCase();
        const matches = (Array.isArray(listings) ? listings : [])
          .filter((listing) =>
            `${listing.name || ""} ${listing.location || ""}`
              .toLowerCase()
              .includes(term)
          )
          .slice(0, 5);
        setSearchResults(matches);
      } catch {
        setSearchResults([]);
      }
    }, 250);
  };

  const handleSelectResult = (listingId) => {
    setQuery("");
    setSearchResults([]);

    if (area === "guest") {
      navigate(`/guest/unit-listings/${listingId}`);
    } else {
      navigate(`/unit-listings/${listingId}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 h-[72px] shrink-0 border-b border-cream-200 bg-white">
      <div className="flex h-full min-w-0 items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        {/* Mobile / Tablet */}
        <div className="flex min-w-0 items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cream-200 text-plum-800 hover:bg-cream-50"
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

        {/* Desktop Search */}
        <div ref={searchRef} className="relative hidden w-[310px] lg:block">
          <Search
            size={18}
            strokeWidth={1.7}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder={
              area === "guest" ? "Search stays..." : "Search units..."
            }
            className="h-[40px] w-full rounded-xl bg-cream-50 pl-11 pr-4 text-[13px] text-plum-800 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
          />

          {searchResults.length > 0 ? (
            <div className="absolute left-0 top-12 z-50 w-full overflow-hidden rounded-2xl border border-cream-200 bg-white p-2 shadow-xl">
              {searchResults.map((listing) => (
                <button
                  key={listing.id}
                  type="button"
                  onClick={() => handleSelectResult(listing.id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-plum-800 hover:bg-cream-50"
                >
                  <span className="min-w-0 truncate">{listing.name}</span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {listing.location || ""}
                  </span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:gap-5">
          {/* Notifications — honest empty state (no backend notification feed) */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotificationsOpen((current) => !current)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-plum-800 hover:bg-cream-100"
            >
              <Bell size={20} strokeWidth={1.7} />
            </button>

            {notificationsOpen ? (
              <div className="absolute right-0 top-12 z-[100] w-64 overflow-hidden rounded-2xl border border-cream-200 bg-white p-4 shadow-xl">
                <p className="text-sm font-semibold text-plum-800">Notifications</p>
                {notifications.length === 0 ? (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    No notifications yet. Booking and turnover alerts will appear here
                    as they become available.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((current) => !current);
                setNotificationsOpen(false);
              }}
              aria-expanded={profileOpen}
              className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-cream-50"
            >
              {/* Avatar */}
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream-100 text-plum-800">
                {area === "guest" ? (
                  <User size={18} />
                ) : (
                  <span className="font-serif text-[15px] font-medium">{avatarInitials}</span>
                )}
              </div>

              {/* Name */}
              <div className="hidden flex-col items-start sm:flex">
                <span className="text-[13px] font-semibold text-plum-800">{displayName}</span>
                <span className="mt-1 text-[10px] text-slate-400">{areaLabel}</span>
              </div>

              <ChevronDown
                size={16}
                strokeWidth={1.7}
                className={`ml-1 text-plum-800 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {profileOpen ? (
              <div className="absolute right-0 top-12 z-[100] w-52 overflow-hidden rounded-2xl border border-cream-200 bg-white p-2 shadow-xl">
                <div className="px-3 pb-2 pt-1">
                  <p className="truncate text-sm font-semibold text-plum-800">{displayName}</p>
                  <p className="truncate text-xs text-slate-400">{sessionUser?.email || "—"}</p>
                </div>

                <div className="my-1 h-px bg-cream-200" />

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate(profilePath);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-plum-800 hover:bg-cream-50"
                >
                  {area === "guest" ? <User size={17} /> : <UserRound size={17} />}
                  <span>{area === "guest" ? "Profile" : "Account"}</span>
                </button>

                <div className="my-1 h-px bg-cream-200" />

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-red-700 hover:bg-red-50"
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopNavbar;
