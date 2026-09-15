import { Link } from "react-router-dom";

/**
 * Shared brand shell for the Owner / Guest login pages: plum brand panel on the
 * left, form slot on the right.
 */
function AuthShell({ tagline, description, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50 text-plum-800 lg:flex-row">
      {/* ================= BRAND PANEL ================= */}
      <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden bg-gradient-to-br from-plum-800 via-plum-900 to-plum-950 px-6 py-10 text-white sm:px-10 lg:min-h-screen lg:w-[45%] lg:px-14 lg:py-14">
        {/* Decorative petals */}
        <div className="absolute -right-8 top-10 h-32 w-16 rotate-[20deg] rounded-[100%] bg-cream-100/20 sm:h-40 sm:w-20" />
        <div className="absolute -left-10 bottom-16 h-28 w-14 rotate-[-30deg] rounded-[100%] bg-rose-300/15 sm:h-36 sm:w-20" />

        <div className="relative z-10">
          <Link to="/" className="inline-block" aria-label="Meridian Stays home">
            <div className="relative mb-4 h-12 w-16">
              <div className="absolute left-7 top-0 h-8 w-4 rotate-[-8deg] rounded-[100%] bg-cream-100" />
              <div className="absolute left-2 top-4 h-7 w-4 rotate-[-45deg] rounded-[100%] bg-rose-400" />
              <div className="absolute right-2 top-4 h-7 w-4 rotate-[45deg] rounded-[100%] bg-rose-300" />
              <div className="absolute left-6 top-6 h-5 w-5 rounded-full bg-rose-200" />
            </div>

            <h1 className="font-serif text-2xl font-medium tracking-[4px] sm:text-3xl">
              MERIDIAN STAYS
            </h1>
            <p className="mt-2 text-xs tracking-wide text-cream-100/80 sm:text-sm">
              Where Stays Feel Like Home
            </p>
          </Link>
        </div>

        <div className="relative z-10 mt-10 max-w-md">
          <p className="font-serif text-2xl leading-snug sm:text-3xl">{tagline}</p>
          <p className="mt-4 text-sm leading-6 text-white/80">{description}</p>
        </div>
      </div>

      {/* ================= FORM PANEL ================= */}
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

export default AuthShell;
