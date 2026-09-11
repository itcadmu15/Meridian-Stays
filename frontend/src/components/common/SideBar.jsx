import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UserRound,
  House,
  CalendarDays,
  CreditCard,
  BarChart3,
  Settings,
  CircleHelp,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Owner Account",
    path: "/owner/account",
    icon: UserRound,
  },
  {
    name: "My Properties",
    path: "/owner/properties",
    icon: House,
  },
  {
    name: "Bookings",
    path: "/owner/bookings",
    icon: CalendarDays,
  },
  {
    name: "Payouts",
    path: "/owner/payouts",
    icon: CreditCard,
  },
  {
    name: "Reports",
    path: "/owner/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/owner/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-[280px] shrink-0 flex-col bg-gradient-to-b from-[#54213f] via-[#4a1c38] to-[#36152c] text-white">

      {/* ================= LOGO ================= */}
      <div className="flex flex-col items-center px-6 pt-7 pb-9">

        {/* Flower Logo */}
        <div className="relative mb-3 h-14 w-20">

          <div className="absolute left-9 top-0 h-9 w-5 rotate-[-8deg] rounded-[100%] bg-[#e7a9b6]" />

          <div className="absolute left-3 top-5 h-8 w-5 rotate-[-45deg] rounded-[100%] bg-[#c9829b]" />

          <div className="absolute right-3 top-5 h-8 w-5 rotate-[45deg] rounded-[100%] bg-[#d894a7]" />

          <div className="absolute left-8 top-7 h-6 w-6 rounded-full bg-[#f0c6ce]" />

        </div>

        <h1 className="font-serif text-[21px] font-medium tracking-[4px]">
          MERIDIAN STAYS
        </h1>

        <p className="mt-2 text-[11px] tracking-wide text-[#e8cbd6]">
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
                className={({ isActive }) => `
                  group flex h-[52px] items-center gap-5
                  rounded-xl px-5
                  text-[16px] font-medium
                  transition-all duration-200

                  ${
                    isActive
                      ? "bg-[#8b4a6b] text-white shadow-sm"
                      : "text-[#eadbe3] hover:bg-[#713653] hover:text-white"
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={22}
                      strokeWidth={1.7}
                      className={`
                        shrink-0 transition-colors
                        ${
                          isActive
                            ? "text-white"
                            : "text-[#eadbe3] group-hover:text-white"
                        }
                      `}
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
      <div className="mx-4 mb-7 overflow-hidden rounded-xl bg-[#f7e1e3] text-[#54213f]">

        <div className="relative flex min-h-[120px] items-center px-5 py-5">

          {/* Decorative Leaves */}
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

            <div className="mt-3 h-[1px] w-10 bg-[#8b4a6b]" />

          </div>

        </div>

      </div>


      {/* ================= HELP SECTION ================= */}
      <div className="border-t border-white/10 px-6 py-6">

        <div className="flex items-start gap-4">

          <CircleHelp
            size={20}
            strokeWidth={1.6}
            className="mt-0.5 shrink-0 text-[#e5cdd8]"
          />

          <div>

            <p className="text-[13px] font-medium text-[#eadbe3]">
              Need help?
            </p>

            <p className="mt-1 text-[11px] text-[#cfaebe]">
              support@meridianstays.com
            </p>

          </div>

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;