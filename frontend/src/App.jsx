import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/common/SideBar";
import TopNavbar from "./components/common/TopNavbar";

import OwnerAccount from "./pages/OwnerAccount";
import MyProperties from "./pages/MyProperties";
import Payouts from "./pages/Payouts";

function Dashboard() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">Dashboard</h1>
      <p className="mt-2 text-gray-500">Dashboard content goes here.</p>
    </div>
  );
}

function Bookings() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">Bookings</h1>
    </div>
  );
}

function Reports() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">Reports</h1>
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h1 className="font-serif text-3xl text-[#54213f]">Settings</h1>
    </div>
  );
}

function App() {
  const [owner, setOwner] = useState({
    name: "Priyam Sharma",
    email: "priyam.sharma@example.com",
    phone: "+91 98765 43210",
    payout_terms: "Monthly",
    payout_percentage: 80,
    is_active: true,
  });

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf7f8]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Pass owner to TopNavbar */}
        <TopNavbar owner={owner} />

        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route
              path="/"
              element={
                <OwnerAccount
                  owner={owner}
                  setOwner={setOwner}
                />
              }
            />

            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/owner/properties"
              element={<MyProperties />}
            />

            <Route
              path="/owner/bookings"
              element={<Bookings />}
            />

            <Route
              path="/owner/payouts"
              element={<Payouts />}
            />

            <Route
              path="/owner/reports"
              element={<Reports />}
            />

            <Route
              path="/owner/settings"
              element={<Settings />}
            />

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