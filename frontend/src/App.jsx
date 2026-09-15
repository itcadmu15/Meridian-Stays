import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import SideBar from "./components/common/SideBar";
import TopNavbar from "./components/common/TopNavbar";

import OwnerAccount from "./pages/OwnerAccount";
import MyProperties from "./pages/MyProperties";
import Payouts from "./pages/Payouts";

import { getOwnerAccount } from "./services/ownerService";

function App() {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch owner data from backend
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOwnerAccount();

        console.log("Owner data from backend:", data);

        setOwner(data);
      } catch (err) {
        console.error("Error fetching owner:", err);

        setError(
          err.message || "Failed to load owner account."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOwner();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f8]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#eadde3] border-t-[#54213f]" />

          <p className="text-sm text-gray-600">
            Loading owner account...
          </p>
        </div>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f8] px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-red-700">
            Unable to load account
          </h2>

          <p className="mb-5 text-sm text-gray-600">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-[#681744] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#54213f]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#faf7f8]">
      {/* Sidebar */}
      <SideBar />

      {/* Main application area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Navbar */}
        <TopNavbar owner={owner} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>

            {/* Owner Account */}
            <Route
              path="/"
              element={
                <OwnerAccount
                  owner={owner}
                  setOwner={setOwner}
                />
              }
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <div className="p-8">
                  <h1 className="font-serif text-3xl font-semibold text-[#54213f]">
                    Dashboard
                  </h1>
                </div>
              }
            />

            {/* My Properties */}
            <Route
              path="/owner/properties"
              element={<MyProperties />}
            />

            {/* Bookings */}
            <Route
              path="/owner/bookings"
              element={
                <div className="p-8">
                  <h1 className="font-serif text-3xl font-semibold text-[#54213f]">
                    Bookings
                  </h1>
                </div>
              }
            />

            {/* Payouts */}
            <Route
              path="/owner/payouts"
              element={<Payouts />}
            />

            {/* Reports */}
            <Route
              path="/owner/reports"
              element={
                <div className="p-8">
                  <h1 className="font-serif text-3xl font-semibold text-[#54213f]">
                    Reports
                  </h1>
                </div>
              }
            />

            {/* Settings */}
            <Route
              path="/owner/settings"
              element={
                <div className="p-8">
                  <h1 className="font-serif text-3xl font-semibold text-[#54213f]">
                    Settings
                  </h1>
                </div>
              }
            />

            {/* Unknown route → Owner Account */}
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