import React from "react";
import Sidebar from "./components/common/SideBar";
import TopNavbar from "./components/common/TopNavbar";

function App() {
  return (
    <div className="flex h-screen bg-[#faf7f8]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex flex-1 flex-col">

        {/* Top Navbar */}
        <TopNavbar />

        {/* Page Content */}
        <main className="flex-1 p-8">
          <h1 className="font-serif text-3xl text-[#54213f]">
            Meridian Stays
          </h1>

          <p className="mt-2 text-gray-500">
            Dashboard content goes here.
          </p>
        </main>

      </div>

    </div>
  );
}

export default App;