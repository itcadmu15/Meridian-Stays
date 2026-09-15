import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Sidebar from "./components/common/SideBar";
import TopNavbar from "./components/common/TopNavbar";
import CleaningSchedule from "./pages/CleaningSchedule";

function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#faf7f8]">

      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">

        <TopNavbar />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route
              path="/cleaning-schedule"
              element={<CleaningSchedule />}
            />

            <Route
              path="/"
              element={<Navigate to="/cleaning-schedule" replace />}
            />

            <Route
              path="*"
              element={<Navigate to="/cleaning-schedule" replace />}
            />
          </Routes>
        </main>

      </div>

    </div>
  );
}

export default App;