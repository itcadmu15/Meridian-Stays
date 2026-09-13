import React from "react";
import { Search } from "lucide-react";

function PropertyFilters({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
}) {
  const tabs = [
    {
      name: "All Properties",
      value: "all",
    },
    {
      name: "Active",
      value: "active",
    },
    {
      name: "Inactive",
      value: "inactive",
    },
    {
      name: "Drafts",
      value: "draft",
    },
  ];

  return (
    <div className="mb-5 flex flex-col gap-4 border-b border-gray-200 pb-0 lg:flex-row lg:items-end lg:justify-between">

      {/* Tabs */}
      <div className="flex gap-7">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`relative pb-3 text-sm font-medium transition ${
              activeTab === tab.value
                ? "text-[#54213f]"
                : "text-gray-500 hover:text-[#54213f]"
            }`}
          >
            {tab.name}

            {activeTab === tab.value && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] rounded-full bg-[#713653]" />
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 pb-3">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-56 rounded-lg border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#8b4a6b]"
          />
        </div>

        <button className="flex h-10 items-center gap-2 rounded-lg bg-[#681744] px-5 text-sm font-medium text-white transition hover:bg-[#54213f]">
          <span className="text-lg leading-none">+</span>
          Add Property
        </button>
      </div>
    </div>
  );
}

export default PropertyFilters;