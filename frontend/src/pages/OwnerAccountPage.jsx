import { getSessionUser } from "../services/authService";

function OwnerAccountPage() {
  const sessionUser = getSessionUser();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-slate-500">Home &gt; Owner Account</p>
        <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
          Owner Account
        </h1>
        <p className="text-sm text-slate-500">Your Meridian Stays account details.</p>
      </div>

      <section className="max-w-xl rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 font-serif text-lg font-semibold text-plum-800">
            {(sessionUser?.name || "P S")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-serif text-2xl font-semibold text-plum-800">
              {sessionUser?.name || "Priyam Sharma"}
            </p>
            <p className="truncate text-sm text-slate-500">{sessionUser?.email || "—"}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-cream-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Experience</p>
            <p className="mt-2 text-sm font-medium capitalize text-plum-800">
              {sessionUser?.area || "owner"}
            </p>
          </div>
          <div className="rounded-2xl bg-cream-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Account status</p>
            <p className="mt-2 text-sm font-medium text-plum-800">Active</p>
          </div>
        </div>

        <p className="mt-5 rounded-2xl border border-dashed border-cream-200 px-4 py-3 text-xs leading-5 text-slate-500">
          Profile editing will arrive with the shared account service — this page shows the
          current session account only. Authentication and authorization are handled by the
          backend team.
        </p>
      </section>
    </div>
  );
}

export default OwnerAccountPage;
