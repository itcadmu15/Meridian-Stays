import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../common/SideBar";
import TopNavbar from "../common/TopNavbar";

const AuthenticatedLayout = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream-50 text-plum-800">
      <SideBar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar onMenuClick={() => setMobileNavOpen(true)} />

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-10 lg:py-10">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;