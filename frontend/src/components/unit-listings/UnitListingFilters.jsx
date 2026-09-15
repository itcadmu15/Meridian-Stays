import { Search, X } from "lucide-react";

function UnitListingFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onClear,
  hasFilters = false,
}) {
  const tabs = [
    { key: "all", label: "All Units" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "draft", label: "Draft" },
  ];

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          type="search"
          placeholder="Search by name, location or description..."
          className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 pl-11 pr-11 text-sm text-plum-800 outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10"
        />
        {search ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-plum-800"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onStatusChange(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              status === tab.key
                ? "bg-plum-800 text-white"
                : "bg-white text-slate-600 hover:bg-cream-50"
            }`}
          >
            {tab.label}
          </button>
        ))}

        {hasFilters ? (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-cream-200 px-4 py-2 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
          >
            <X size={14} />
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default UnitListingFilters;
