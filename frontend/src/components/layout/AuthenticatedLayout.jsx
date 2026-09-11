import React from "react";
import SideBar from "../common/SideBar";

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#faf7f8]">

      {/* Sidebar */}
      <SideBar />

      {/* Right side */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Navbar will go here */}
        <header className="h-[64px] border-b border-[#eadfe4] bg-white">
          <div className="flex h-full items-center justify-end px-6">
            <span className="text-sm text-gray-600">
              Welcome back
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AuthenticatedLayout;