import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "../common/SideBar";
import TopNavbar from "../common/TopNavbar";
import { isAreaAuthenticated } from "../../services/authService";

/**
 * Area-aware application shell.
 *
 * The sidebar stays fixed on desktop while the main application area
 * handles its own scrolling. On mobile, the sidebar is controlled by
 * the mobile menu state.
 */
const LOGIN_PATHS = {
  owner: "/owner/login",
  staff: "/owner/login",
  guest: "/guest/login",
};

function AuthenticatedLayout({ area = "owner" }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!isAreaAuthenticated(area)) {
    return (
      <Navigate
        to={LOGIN_PATHS[area] || "/owner/login"}
        replace
      />
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-cream-50 text-plum-800">
      {/* Sidebar */}
      <SideBar
        area={area}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      {/* Main application area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <TopNavbar
          area={area}
          onMenuClick={() => setMobileNavOpen(true)}
        />

        {/* Scrollable page content */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10">
            <div className="mx-auto w-full max-w-7xl">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 border-t border-cream-200 px-4 py-4 text-center text-xs text-slate-400 sm:px-6 lg:px-10">
          Meridian Stays · Where Stays Feel Like Home
        </footer>
      </div>
    </div>
  );
}

export default AuthenticatedLayout;