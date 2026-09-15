import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import AuthShell from "../components/layout/AuthShell";
import { login } from "../services/authService";

/**
 * Shared login form for the two simple entry points:
 *  - /owner/login → opens the owner experience
 *  - /guest/login → opens the guest experience
 * No roles, no RBAC — the area only decides which frontend opens.
 */
function Login({ area = "owner" }) {
  const navigate = useNavigate();
  const isGuest = area === "guest";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const validate = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);

    try {
      await login({ email, password, area });
      navigate(isGuest ? "/guest" : "/dashboard", { replace: true });
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      tagline={
        isGuest
          ? "Your next stay is a few clicks away."
          : "Elegant stays, effortless management."
      }
      description={
        isGuest
          ? "Sign in to browse stays, book your next trip and chat with your property assistant."
          : "Sign in to manage your unit listings, bookings, reports and the Meridian assistant — all in one place."
      }
    >
      <div className="rounded-[28px] border border-cream-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-3xl font-semibold text-plum-800">
          {isGuest ? "Guest sign in" : "Owner sign in"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {isGuest
            ? "Access your Meridian Stays guest experience."
            : "Access your Meridian Stays owner workspace."}
        </p>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-plum-800">Email</span>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setFieldErrors((current) => ({ ...current, email: undefined }));
                }}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 pl-10 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
              />
            </div>
            {fieldErrors.email ? (
              <p className="text-xs text-red-600">{fieldErrors.email}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-plum-800">Password</span>
            <div className="relative">
              <Lock
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setFieldErrors((current) => ({ ...current, password: undefined }));
                }}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 pl-10 pr-11 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:text-plum-800"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password ? (
              <p className="text-xs text-red-600">{fieldErrors.password}</p>
            ) : null}
          </label>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-plum-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Demo credentials:{" "}
          <span className="font-medium text-plum-800">
            {isGuest ? "guest@meridianstays.com" : "owner@meridianstays.com"} / meridian
          </span>
        </p>

        <p className="mt-4 border-t border-cream-100 pt-4 text-center text-sm text-slate-500">
          {isGuest ? "Own a property? " : "Booking a stay? "}
          <Link
            to={isGuest ? "/owner/login" : "/guest/login"}
            className="font-medium text-plum-800 underline underline-offset-4 hover:text-plum-600"
          >
            {isGuest ? "Owner login" : "Guest login"}
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default Login;
