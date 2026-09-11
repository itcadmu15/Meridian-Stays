import { useEffect, useState } from "react";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import { getGuest, resolveGuestId } from "../../services/guestService";

function GuestProfilePage() {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadGuest = async () => {
      setLoading(true);
      setError("");

      try {
        const guestId = await resolveGuestId();
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
    };

    loadGuest();
  }, []);

  if (loading) return <Loading label="Loading profile..." />;
  if (error) return <ErrorMsg title="Unable to load guest profile." message={error} />;

  if (!guest) {
    return (
      <div className="rounded-[28px] border border-dashed border-rose-300 bg-white px-6 py-14 text-center shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-plum-800">Profile</h1>
        <p className="mt-2 text-sm text-slate-500">No guest profile is linked yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Guest &gt; Profile</p>
        <h1 className="font-serif text-4xl font-semibold text-plum-800">Profile</h1>
        <p className="text-sm text-slate-500">Review your account details and preferences.</p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm">
          <p className="break-words font-serif text-2xl font-semibold text-plum-800">{guest.name}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-cream-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Email</p>
              <p className="mt-2 break-words text-sm font-medium text-plum-800">{guest.email}</p>
            </div>
            <div className="rounded-2xl bg-cream-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Phone</p>
              <p className="mt-2 break-words text-sm font-medium text-plum-800">{guest.phone || "Not provided"}</p>
            </div>
            <div className="rounded-2xl bg-cream-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Loyalty tier</p>
              <p className="mt-2 text-sm font-medium text-plum-800">{guest.loyalty_tier}</p>
            </div>
            <div className="rounded-2xl bg-cream-50 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Guest ID</p>
              <p className="mt-2 break-all text-sm font-medium text-plum-800">{guest.id}</p>
            </div>
          </div>
        </section>

        <aside className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm">
          <p className="font-serif text-2xl font-semibold text-plum-800">Preferences</p>
          <div className="mt-4 space-y-4 text-sm text-slate-600">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Dietary</p>
              <p className="mt-2">{guest.preferences?.dietary?.join(", ") || "None saved"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Room preferences</p>
              <p className="mt-2">{guest.preferences?.room_preferences?.join(", ") || "None saved"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Notes</p>
              <p className="mt-2">{guest.preferences?.notes?.join(", ") || "None saved"}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default GuestProfilePage;