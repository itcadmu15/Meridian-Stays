import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Search } from "lucide-react";
import Loading from "../../components/common/Loading";
import ErrorMsg from "../../components/common/ErrorMsg";
import { getGuests } from "../../services/guestService";
import { formatDate } from "../../utils/format";

function GuestsPage() {
  const navigate = useNavigate();
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadGuests = async (searchTerm = "") => {
    setLoading(true);
    setError("");

    try {
      const data = await getGuests(searchTerm ? { search: searchTerm } : {});
      setGuests(Array.isArray(data) ? data : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load guests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGuests();
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    loadGuests(search);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Home &gt; Guests</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">Guests</h1>
        <p className="max-w-2xl text-sm leading-6 text-slate-500">
          Directory of every guest in the Meridian Stays records.
        </p>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          type="search"
          placeholder="Search guests by name or email..."
          className="w-full rounded-2xl border border-cream-200 bg-white px-4 py-3 pl-11 pr-24 text-sm text-plum-800 outline-none transition focus:border-plum-500 focus:ring-2 focus:ring-plum-500/10"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-plum-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-plum-700"
        >
          Search
        </button>
      </form>

      {loading ? <Loading label="Loading guests..." /> : null}

      {!loading && error ? (
        <ErrorMsg title="Unable to load guests." message={error} onRetry={() => loadGuests(search)} />
      ) : null}

      {!loading && !error && guests.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-rose-300 bg-white px-6 py-14 text-center shadow-sm">
          <h2 className="font-serif text-2xl font-semibold text-plum-800">No guests found.</h2>
          <p className="mt-2 text-sm text-slate-500">Try a different search term.</p>
        </div>
      ) : null}

      {!loading && !error && guests.length > 0 ? (
        <div className="space-y-3">
          {guests.map((guest) => (
            <button
              key={guest.id}
              type="button"
              onClick={() => navigate(`/guests/${guest.id}`)}
              className="flex w-full items-center justify-between gap-4 rounded-[24px] border border-cream-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5"
            >
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-100 font-serif text-sm font-semibold text-plum-800">
                  {(guest.name || "?")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-serif text-lg font-semibold text-plum-800">
                    {guest.name}
                  </p>
                  <p className="truncate text-sm text-slate-500">{guest.email}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                <div className="hidden text-right sm:block">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Loyalty</p>
                  <p className="mt-1 text-sm font-medium capitalize text-plum-800">
                    {guest.loyalty_tier}
                  </p>
                </div>

                <div className="hidden text-right md:block">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Since</p>
                  <p className="mt-1 text-sm font-medium text-plum-800">
                    {formatDate(guest.created_at)}
                  </p>
                </div>

                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 text-plum-800">
                  <ChevronRight size={18} />
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default GuestsPage;
