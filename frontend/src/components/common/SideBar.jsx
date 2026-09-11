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
    <aside className="flex h-screen w-[210px] flex-col bg-gradient-to-b from-[#54213f] via-[#4a1c38] to-[#36152c] text-white">
      
      {/* Logo */}
      <div className="flex flex-col items-center px-5 pt-6 pb-8">
        
        {/* Simple flower logo */}
        <div className="relative mb-2 h-10 w-16">
          <div className="absolute left-7 top-0 h-7 w-4 rotate-[-8deg] rounded-[100%] bg-[#e7a9b6]" />
          <div className="absolute left-3 top-3 h-6 w-4 rotate-[-45deg] rounded-[100%] bg-[#c9829b]" />
          <div className="absolute right-3 top-3 h-6 w-4 rotate-[45deg] rounded-[100%] bg-[#d894a7]" />
          <div className="absolute left-7 top-6 h-4 w-4 rounded-full bg-[#f0c6ce]" />
        </div>

        <h1 className="font-serif text-[17px] tracking-[3px]">
          MERIDIAN STAYS
        </h1>

        <p className="mt-1 text-[9px] tracking-wide text-[#e8cbd6]">
          Where Stays Feel Like Home
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `
                  group flex h-[38px] items-center gap-4 rounded-lg px-3
                  text-[12px] transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#8b4a6b] text-white shadow-sm"
                      : "text-[#eadbe3] hover:bg-[#713653] hover:text-white"
                  }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={17}
                      strokeWidth={1.7}
                      className={
                        isActive
                          ? "text-white"
                          : "text-[#eadbe3] group-hover:text-white"
                      }
                    />

                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Promotional Card */}
      <div className="mx-3 mb-6 overflow-hidden rounded-lg bg-[#f7e1e3] text-[#54213f]">
        <div className="relative flex min-h-[94px] items-center px-4 py-4">
          
          {/* Decorative leaf */}
          <div className="absolute -left-1 bottom-0 h-16 w-9 rotate-[-15deg] rounded-[100%] bg-[#d5e1d8] opacity-90" />

          <div className="relative z-10 ml-12">
            <p className="font-serif text-[13px] leading-[1.3]">
              Grow
              <br />
              Your Hospitality
              <br />
              Journey with Us
            </p>

            <div className="mt-2 h-[1px] w-8 bg-[#8b4a6b]" />
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="px-5 pb-5">
        <div className="flex items-start gap-3">
          <CircleHelp
            size={15}
            strokeWidth={1.6}
            className="mt-0.5 text-[#e5cdd8]"
          />

          <div>
            <p className="text-[10px] text-[#eadbe3]">
              Need help?
            </p>

            <p className="mt-1 text-[9px] text-[#cfaebe]">
              support@meridianstays.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;