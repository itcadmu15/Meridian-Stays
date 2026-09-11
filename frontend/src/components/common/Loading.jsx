function Loading({ label = "Loading..." }) {
	return (
		<div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#eadfe4] bg-white shadow-sm">
			<div className="flex items-center gap-3 text-sm text-slate-600">
				<span className="h-4 w-4 animate-spin rounded-full border-2 border-[#54213f] border-t-transparent" />
				<span>{label}</span>
			</div>
		</div>
	);
}

export default Loading;
