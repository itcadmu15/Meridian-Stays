import { AlertCircle, RotateCcw } from "lucide-react";

const NETWORK_HINTS = ["failed to fetch", "networkerror", "load failed", "fetch failed"];

function isNetworkError(message) {
  if (!message) return false;
  return NETWORK_HINTS.some((hint) => message.toLowerCase().includes(hint));
}

function ErrorMsg({ title = "Unable to load data.", message, onRetry, retryLabel = "Retry" }) {
  const networkIssue = isNetworkError(message);

  return (
    <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg font-semibold text-plum-800">{title}</p>

          {networkIssue ? (
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Please check that the Meridian Stays backend is running and try again.
            </p>
          ) : null}

          {message ? (
            <p className="mt-1 break-words text-sm leading-6 text-slate-500">
              {networkIssue ? `(${message})` : message}
            </p>
          ) : null}

          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-plum-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-plum-700"
            >
              <RotateCcw size={16} />
              {retryLabel}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ErrorMsg;
