import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/common/SideBar";
import TopNavbar from "./components/common/TopNavbar";

import OwnerAccount from "./pages/OwnerAccount";
import MyProperties from "./pages/MyProperties";
import Payouts from "./pages/Payouts";

function Dashboard() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-500">
        Dashboard content goes here.
      </p>
    </div>
  );
}

function Bookings() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">
        Bookings
      </h1>
    </div>
  );
}

function Reports() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">
        Reports
      </h1>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">
        Settings
      </h1>
    </div>
  );
}

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#faf7f8]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>

            {/* Owner Account */}
            <Route
              path="/"
              element={<OwnerAccount />}
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* My Properties */}
            <Route
              path="/owner/properties"
              element={<MyProperties />}
            />

            {/* Bookings */}
            <Route
              path="/owner/bookings"
              element={<Bookings />}
            />

            {/* Payouts */}
            <Route
              path="/owner/payouts"
              element={<Payouts />}
            />

            {/* Reports */}
            <Route
              path="/owner/reports"
              element={<Reports />}
            />

            {/* Settings */}
            <Route
              path="/owner/settings"
              element={<Settings />}
            />

            {/* Unknown Route */}
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />

          </Routes>
        </main>

      </div>
    </div>
  );
}

export default App;