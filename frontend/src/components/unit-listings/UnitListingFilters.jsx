import { Search } from "lucide-react";

function UnitListingFilters({ search, onSearchChange, status, onStatusChange }) {
  const tabs = [
    { key: "all", label: "All Units" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          type="search"
          placeholder="Search units..."
          className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 pl-11 text-sm text-plum-800 outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onStatusChange(tab.key)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${status === tab.key ? "bg-plum-800 text-white" : "bg-white text-slate-600 hover:bg-cream-50"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default UnitListingFilters;