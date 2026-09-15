import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import EmptyState from "../../components/common/EmptyState";
import { getGuest, resolveGuestId } from "../../services/guestService";
import { getSessionUser } from "../../services/authService";
import { formatDate } from "../../utils/format";

function GuestProfilePage() {
  const navigate = useNavigate();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGuest = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const sessionUser = getSessionUser();
      const guestId = await resolveGuestId(sessionUser?.email);
      if (!guestId) {
        setGuest(null);
        return;
      }

      const data = await getGuest(guestId);
      setGuest(data);
    } catch (loadError) {
      setError(loadError.message || "Unable to load guest profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial data fetch
    loadGuest();
  }, [loadGuest]);

  if (loading) return <Loading label="Loading profile..." />;
  if (error) {
    return (
      <ErrorMsg title="Unable to load guest profile." message={error} onRetry={loadGuest} />
    );
  }

  if (!guest) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">Guest &gt; Profile</p>
          <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
            Profile
          </h1>
        </div>

        <EmptyState
          title="No guest profile is linked yet."
          message="Your profile appears once the Meridian Stays backend has a guest record for your session. Make sure the backend is running and seeded, then try again."
          action={
            <button
              type="button"
              onClick={loadGuest}
              className="inline-flex items-center gap-2 rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          }
        />
      </div>
    );
  }

  const preferences = guest.preferences || {};

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Guest &gt; Profile</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          Profile
        </h1>
        <p className="text-sm text-slate-500">
          Review your account details and preferences.
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-cream-100 font-serif text-lg font-semibold text-plum-800">
              {(guest.name || "?")
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="break-words font-serif text-2xl font-semibold text-plum-800">
                {guest.name}
              </p>
              <p className="text-sm capitalize text-slate-500">
                {guest.loyalty_tier} tier · guest since {formatDate(guest.created_at)}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-cream-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Email</p>
              <p className="mt-2 break-words text-sm font-medium text-plum-800">
                {guest.email}
              </p>
            </div>
            <div className="rounded-2xl bg-cream-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Phone</p>
              <p className="mt-2 break-words text-sm font-medium text-plum-800">
                {guest.phone || "Not provided"}
              </p>
            </div>
            <div className="rounded-2xl bg-cream-50 p-4 md:col-span-2">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Guest ID</p>
              <p className="mt-2 break-all text-sm font-medium text-plum-800">{guest.id}</p>
            </div>
          </div>
        </section>

        <aside className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-semibold text-plum-800">Preferences</p>
          <p className="mt-1 text-xs text-slate-400">
            Saved by the Meridian Stays concierge team.
          </p>

          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Dietary</p>
              <p className="mt-2">
                {preferences.dietary?.length
                  ? preferences.dietary.join(", ")
                  : "None saved"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Room preferences
              </p>
              <p className="mt-2">
                {preferences.room_preferences?.length
                  ? preferences.room_preferences.join(", ")
                  : "None saved"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Notes</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {preferences.notes?.length ? (
                  preferences.notes.map((note, index) => <li key={index}>{note}</li>)
                ) : (
                  <li className="list-none">None saved</li>
                )}
              </ul>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/guest/assistant")}
            className="mt-6 w-full rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700"
          >
            Ask the Assistant about your stay
          </button>
        </aside>
      </div>
    </div>
  );
}

export default GuestProfilePage;
