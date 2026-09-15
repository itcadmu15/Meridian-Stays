import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md rounded-[28px] border border-cream-200 bg-white p-8 text-center shadow-sm">
        <h1 className="font-serif text-3xl font-semibold text-plum-800">Create Account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Account creation is coming soon. In the meantime, sign in to explore Meridian Stays.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/owner/login"
            className="inline-flex items-center justify-center rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700"
          >
            Owner Login
          </Link>
          <Link
            to="/guest/login"
            className="inline-flex items-center justify-center rounded-2xl border border-cream-200 px-5 py-3 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
          >
            Guest Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
