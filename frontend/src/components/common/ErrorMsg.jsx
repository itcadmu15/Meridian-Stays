import { AlertCircle, RotateCcw } from "lucide-react";

function ErrorMsg({ title = "Unable to load data.", message, onRetry }) {
	return (
		<div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
			<div className="flex items-start gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
					<AlertCircle size={18} />
				</div>

				<div className="min-w-0 flex-1">
					<p className="font-serif text-lg font-semibold text-[#54213f]">
						{title}
					</p>

					{message ? (
						<p className="mt-1 text-sm leading-6 text-slate-600">{message}</p>
					) : null}

					{onRetry ? (
						<button
							type="button"
							onClick={onRetry}
							className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#54213f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6a2c51]"
						>
							<RotateCcw size={16} />
							Retry
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}

export default ErrorMsg;
