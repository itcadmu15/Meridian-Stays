import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Bot,
  Eraser,
  MapPin,
  SendHorizontal,
  Sparkles,
  User,
} from "lucide-react";
import ErrorMsg from "../../components/common/ErrorMsg";
import { queryAssistant } from "../../services/assistantService";
import { getUnitListing } from "../../services/unitListingService";
import { resolveGuestId } from "../../services/guestService";
import { getSessionUser } from "../../services/authService";
import { formatCurrency } from "../../utils/format";

const GENERAL_SUGGESTIONS = [
  "What stays are available?",
  "Do you have my dietary preferences on file?",
  "When is my next booking?",
  "What's the best nightly rate right now?",
];

const PROPERTY_SUGGESTIONS = [
  "What is the Wi-Fi policy?",
  "How do I check in?",
  "What time can I check in?",
  "What are the house rules?",
  "What should I do before checking out?",
  "Where can I find property instructions?",
];

function AssistantPage() {
  const params = useParams();
  const location = useLocation();
  const unitId = params.unitId || null;

  const [unit, setUnit] = useState(location.state?.unit || null);
  const [unitError, setUnitError] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [guestId, setGuestId] = useState(null);
  const messagesEndRef = useRef(null);

  // Load the property context when chatting from a specific unit page.
  useEffect(() => {
    if (!unitId) return;

    let cancelled = false;

    getUnitListing(unitId)
      .then((data) => {
        if (!cancelled) setUnit(data);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setUnitError(loadError.message || "Unable to load this property's details.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [unitId]);

  useEffect(() => {
    let cancelled = false;

    resolveGuestId(getSessionUser()?.email)
      .then((resolvedId) => {
        if (!cancelled) setGuestId(resolvedId);
      })
      .catch(() => {
        // Guest context is optional — the assistant still answers listing questions.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const askQuestion = useCallback(
    async (questionText) => {
      const question = (questionText || "").trim();
      if (!question || thinking) return;

      setError("");
      setInput("");
      setMessages((current) => [...current, { role: "user", text: question }]);
      setThinking(true);

      try {
        const data = await queryAssistant({ question, guestId, unitId });
        setMessages((current) => [
          ...current,
          { role: "assistant", text: data.answer },
        ]);
      } catch (askError) {
        setError(askError.message || "The assistant is unavailable right now.");
      } finally {
        setThinking(false);
      }
    },
    [thinking, guestId, unitId]
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      askQuestion(input);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError("");
    setInput("");
  };

  const suggestions = unitId ? PROPERTY_SUGGESTIONS : GENERAL_SUGGESTIONS;

  return (
    <div className="flex flex-col space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-slate-500">
            {unitId ? "Property Assistant" : "Meridian Assistant"}
          </p>
          <h1 className="font-serif text-3xl font-semibold text-plum-800 md:text-4xl">
            {unitId ? "Your Stay Assistant" : "Guest Assistant"}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-500">
            {unitId
              ? `Answers are grounded in this property's records and documents${
                  unit?.name ? ` — you're chatting about ${unit.name}.` : "."
                }`
              : "Ask about available stays, your bookings, and your saved preferences — answers are grounded in our live records."}
          </p>
        </div>

        {messages.length > 0 ? (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex w-fit items-center gap-2 rounded-2xl border border-cream-200 bg-white px-4 py-2.5 text-sm font-medium text-plum-800 transition hover:bg-cream-50"
          >
            <Eraser size={15} />
            Clear conversation
          </button>
        ) : null}
      </div>

      {/* ================= PROPERTY CONTEXT CARD ================= */}
      {unitId ? (
        unit ? (
          <section className="flex flex-col gap-4 rounded-[24px] border border-cream-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cream-100 text-plum-800">
                <MapPin size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate font-serif text-xl font-semibold text-plum-800">
                  {unit.name}
                </p>
                <p className="truncate text-sm text-slate-500">
                  {unit.location || "Location not provided"} ·{" "}
                  {formatCurrency(unit.nightly_rate)}/night
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-cream-100 px-3 py-1.5 text-xs font-medium text-plum-800">
              <Sparkles size={13} />
              Assistant scoped to this property
            </span>
          </section>
        ) : unitError ? (
          <ErrorMsg title="Unable to load this property." message={unitError} />
        ) : (
          <div className="h-[88px] animate-pulse rounded-[24px] border border-cream-200 bg-white shadow-sm" />
        )
      ) : null}

      {/* ================= CHAT PANEL ================= */}
      <section className="flex min-h-[60vh] flex-col overflow-hidden rounded-[28px] border border-cream-200 bg-white shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 && !thinking ? (
            <div className="flex h-full flex-col items-center justify-center px-4 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-plum-800">
                <Sparkles size={26} />
              </div>
              <h2 className="mt-5 font-serif text-2xl font-semibold text-plum-800">
                {unitId ? `Ask about ${unit?.name || "this property"}` : "How can we help your stay?"}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                {unitId
                  ? "I answer from this property's records — amenities, check-in times and house information."
                  : "I answer from Meridian Stays' live records — listings, availability, bookings and guest preferences."}
              </p>

              <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {suggestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => askQuestion(question)}
                    className="rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-left text-sm text-plum-800 transition hover:border-plum-500/40 hover:bg-white"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  message.role === "user"
                    ? "bg-plum-800 text-white"
                    : "bg-cream-100 text-plum-800"
                }`}
              >
                {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
              </div>

              <div
                className={`max-w-[85%] rounded-[20px] px-4 py-3 text-sm leading-6 sm:max-w-[75%] ${
                  message.role === "user"
                    ? "bg-plum-800 text-white"
                    : "bg-cream-50 text-slate-700"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{message.text}</p>
              </div>
            </div>
          ))}

          {thinking ? (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-100 text-plum-800">
                <Bot size={16} />
              </div>
              <div className="flex items-center gap-1.5 rounded-[20px] bg-cream-50 px-4 py-4">
                <span className="h-2 w-2 animate-bounce rounded-full bg-plum-500/70 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-plum-500/70 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-plum-500/70 [animation-delay:300ms]" />
              </div>
            </div>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {error ? (
          <div className="px-4 pb-2 sm:px-6">
            <ErrorMsg
              title="Assistant error."
              message={error}
              onRetry={
                messages.length > 0
                  ? () => askQuestion(messages[messages.length - 1].text)
                  : undefined
              }
              retryLabel="Retry question"
            />
          </div>
        ) : null}

        {/* ================= INPUT BAR ================= */}
        <div className="border-t border-cream-200 p-3 sm:p-4">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={
                unitId
                  ? `Ask about ${unit?.name || "this property"}...`
                  : "Ask about stays, bookings or preferences..."
              }
              className="max-h-32 min-h-[48px] w-full resize-none rounded-2xl border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-plum-800 outline-none transition placeholder:text-slate-400 focus:border-plum-500 focus:bg-white focus:ring-2 focus:ring-plum-500/10"
            />

            <button
              type="button"
              onClick={() => askQuestion(input)}
              disabled={thinking || !input.trim()}
              aria-label="Send message"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-plum-800 text-white transition hover:bg-plum-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendHorizontal size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AssistantPage;
