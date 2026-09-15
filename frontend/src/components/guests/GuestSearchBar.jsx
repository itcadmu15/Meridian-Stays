import { useState } from "react";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";

function GuestSearchBar({ filters, onChange, onSearch }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalFilters((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Commit the typed filters and trigger the search.
    onChange(localFilters);
    if (onSearch) onSearch(localFilters);
  };

  const inputClasses =
    "w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 pl-10 text-sm text-plum-800 outline-none placeholder:text-slate-400 focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[24px] border border-cream-200 bg-white p-4 shadow-lg shadow-plum-800/5 md:p-5"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="relative">
          <MapPin
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            name="location"
            value={localFilters.location}
            onChange={handleChange}
            placeholder="Where to?"
            className={inputClasses}
          />
        </label>

        <label className="relative">
          <CalendarDays
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            name="checkIn"
            type="date"
            value={localFilters.checkIn}
            onChange={handleChange}
            aria-label="Check-in date"
            className={inputClasses}
          />
        </label>

        <label className="relative">
          <CalendarDays
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            name="checkOut"
            type="date"
            value={localFilters.checkOut}
            onChange={handleChange}
            aria-label="Check-out date"
            className={inputClasses}
          />
        </label>

        <label className="relative">
          <Users
            size={16}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            name="guests"
            type="number"
            min="1"
            value={localFilters.guests}
            onChange={handleChange}
            placeholder="Guests"
            className={inputClasses}
          />
        </label>
      </div>

      <button
        type="submit"
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 sm:w-auto sm:min-w-[160px]"
      >
        <Search size={16} />
        Search
      </button>
    </form>
  );
}

export default GuestSearchBar;
