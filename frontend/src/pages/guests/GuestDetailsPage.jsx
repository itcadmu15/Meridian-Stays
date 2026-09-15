import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, formatDateRange } from "../../utils/format";
import ErrorMsg from "../../components/common/ErrorMsg";
import Loading from "../../components/common/Loading";
import { getGuest } from "../../services/guestService";
import { listReservations } from "../../services/reservationService";

function GuestDetailsPage() {
  const { guestId } = useParams();
  const navigate = useNavigate();
  const [guest, setGuest] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadGuest = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [guestData, reservationData] = await Promise.all([
        getGuest(guestId),
        listReservations(),
      ]);

      setGuest(guestData);
      setReservations(
        (Array.isArray(reservationData) ? reservationData : []).filter(
          (reservation) => reservation.guest_id === guestId
        )
      );
    } catch (loadError) {
      setError(loadError.message || "Unable to load this guest.");
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadGuest();
  }, [loadGuest]);

  if (loading) {
    return <Loading label="Loading guest details..." />;
  }

  if (error && !guest) {
    return (
      <ErrorMsg
        title="Unable to load guest details."
        message={error}
        onRetry={loadGuest}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">
          <button
            type="button"
            onClick={() => navigate("/guests")}
            className="hover:text-plum-800"
          >
            Guests
          </button>{" "}
          &gt; Details
        </p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          {guest.name}
        </h1>
        <p className="text-sm text-slate-500">
          Guest since {formatDate(guest.created_at)}
        </p>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="space-y-5">
          <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-semibold text-plum-800">Contact</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-cream-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Email</p>
                <p className="mt-2 break-words text-sm font-medium text-plum-800">{guest.email}</p>
              </div>
              <div className="rounded-2xl bg-cream-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Phone</p>
                <p className="mt-2 break-words text-sm font-medium text-plum-800">
                  {guest.phone || "Not provided"}
                </p>
              </div>
              <div className="rounded-2xl bg-cream-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Loyalty tier</p>
                <p className="mt-2 text-sm font-medium capitalize text-plum-800">
                  {guest.loyalty_tier}
                </p>
              </div>
              <div className="rounded-2xl bg-cream-50 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Guest ID</p>
                <p className="mt-2 break-all text-sm font-medium text-plum-800">{guest.id}</p>
              </div>
            </div>
          </section>

          <section className="min-w-0 rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm">
            <p className="font-serif text-2xl font-semibold text-plum-800">Bookings</p>

            {reservations.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500">No bookings on record yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="flex flex-col gap-3 rounded-2xl bg-cream-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 text-sm">
                      <p className="font-medium text-plum-800">
                        {formatDateRange(reservation.check_in, reservation.check_out)}
                      </p>
                      <p className="mt-1 break-all text-slate-500">
                        Property {reservation.property_id}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-cream-100 px-3 py-1.5 text-xs font-medium capitalize text-plum-800">
                      {String(reservation.status).replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

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

export default GuestDetailsPage;
