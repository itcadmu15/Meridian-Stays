import { CheckCircle2, ArrowLeft, ReceiptText } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function BookingConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const listing = location.state?.listing;
  const guest = location.state?.guest;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-[32px] border border-cream-200 bg-white p-6 text-center shadow-sm sm:p-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7e1e3] text-[#54213f]">
        <CheckCircle2 size={42} />
      </div>

      <h1 className="mt-6 font-serif text-3xl font-semibold text-plum-800 sm:text-4xl">Booking Confirmed!</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">Your stay at {listing?.name || "your selected property"} is booked.</p>
      {guest?.email ? <p className="mt-2 text-sm text-slate-500">Confirmation sent to {guest.email}</p> : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" onClick={() => navigate("/guest/bookings")} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700">
          <ReceiptText size={16} />
          View Booking Details
        </button>
        <Link to="/guest" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default BookingConfirmationPage;