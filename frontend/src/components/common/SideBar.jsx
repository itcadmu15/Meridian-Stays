import { NavLink } from "react-router-dom";
import {
  BarChart3,
  BedDouble,
  CalendarDays,
  CircleHelp,
  Home,
  LayoutDashboard,
  MessageCircle,
  User,
  UserRound,
  Wrench,
  X,
} from "lucide-react";

const AREA_NAVIGATION = {
  owner: [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Owner Account", path: "/owner/account", icon: UserRound },
    { name: "Unit Listings", path: "/unit-listings", icon: BedDouble },
    { name: "Bookings", path: "/owner/bookings", icon: CalendarDays },
    { name: "Reports", path: "/owner/reports", icon: BarChart3 },
  ],
  staff: [
    { name: "Dashboard", path: "/staff", icon: LayoutDashboard },
    { name: "Turnovers", path: "/staff/turnovers", icon: CalendarDays },
    { name: "Cleaning Tasks", path: "/staff/cleaning", icon: Wrench },
  ],
  guest: [
    { name: "Home", path: "/guest", icon: Home },
    { name: "Bookings", path: "/guest/bookings", icon: CalendarDays },
    { name: "AI Assistant", path: "/guest/assistant", icon: MessageCircle },
    { name: "Profile", path: "/guest/profile", icon: User },
  ],
};

const AREA_HELP_EMAIL = {
  owner: "support@meridianstays.com",
  staff: "operations@meridianstays.com",
  guest: "guest.support@meridianstays.com",
};

function SideBar({ area = "owner", mobileOpen = false, onClose }) {
  const navigation = AREA_NAVIGATION[area] || AREA_NAVIGATION.owner;

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[280px] max-w-[85vw] shrink-0 flex-col overflow-y-auto bg-gradient-to-b from-plum-800 via-plum-900 to-plum-950 text-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-5 lg:hidden">
          <span className="font-serif text-sm font-semibold tracking-[0.3em] text-white">
            MERIDIAN STAYS
          </span>

          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="rounded-full p-2 text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= LOGO ================= */}
        <div className="flex flex-col items-center px-6 pt-7 pb-9">
          <div className="relative mb-3 h-14 w-20">
            <div className="absolute left-9 top-0 h-9 w-5 rotate-[-8deg] rounded-[100%] bg-cream-100" />
            <div className="absolute left-3 top-5 h-8 w-5 rotate-[-45deg] rounded-[100%] bg-rose-400" />
            <div className="absolute right-3 top-5 h-8 w-5 rotate-[45deg] rounded-[100%] bg-rose-300" />
            <div className="absolute left-8 top-7 h-6 w-6 rounded-full bg-rose-200" />
          </div>

          <h1 className="font-serif text-[21px] font-medium tracking-[4px]">MERIDIAN STAYS</h1>

          <p className="mt-2 text-[11px] tracking-wide text-cream-100/80">
            Where Stays Feel Like Home
          </p>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/guest" || item.path === "/staff"}
                  onClick={onClose}
                  className={({ isActive }) => `
                    group flex h-[52px] items-center gap-5
                    rounded-xl px-5
                    text-[16px] font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-plum-500 text-white shadow-sm"
                        : "text-rose-300 hover:bg-plum-600 hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={22}
                        strokeWidth={1.7}
                        className={`shrink-0 transition-colors ${
                          isActive ? "text-white" : "text-rose-300 group-hover:text-white"
                        }`}
                      />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* ================= PROMOTIONAL CARD ================= */}
        <div className="mx-4 mb-7 overflow-hidden rounded-xl bg-cream-100 text-plum-800">
          <div className="relative flex min-h-[120px] items-center px-5 py-5">
            {/* Decorative leaves */}
            <div className="absolute bottom-0 left-1 h-20 w-10 rotate-[-15deg] rounded-[100%] bg-[#d5e1d8]" />
            <div className="absolute bottom-2 left-7 h-16 w-7 rotate-[20deg] rounded-[100%] bg-[#c4d5c9]" />

            {/* Text */}
            <div className="relative z-10 ml-14">
              <p className="font-serif text-[16px] font-medium leading-[1.35]">
                Grow
                <br />
                Your Hospitality
                <br />
                Journey with Us
              </p>

              <div className="mt-3 h-[1px] w-10 bg-plum-500" />
            </div>
          </div>
        </div>

        {/* ================= HELP SECTION ================= */}
        <div className="border-t border-white/10 px-6 py-6">
          <div className="flex items-start gap-4">
            <CircleHelp size={20} strokeWidth={1.6} className="mt-0.5 shrink-0 text-rose-300" />

            <div>
              <p className="text-[13px] font-medium text-rose-300">Need help?</p>
              <p className="mt-1 break-all text-[11px] text-cream-100/70">
                {AREA_HELP_EMAIL[area] || AREA_HELP_EMAIL.owner}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideBar;
