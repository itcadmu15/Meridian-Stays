function EmptyState({ title, message, icon: Icon, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-cream-200 bg-white px-6 py-14 text-center shadow-sm">
      {Icon ? (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-50 text-plum-500">
          <Icon size={24} strokeWidth={1.6} />
        </div>
      ) : null}

      <h2 className="mt-4 font-serif text-2xl font-semibold text-plum-800">{title}</h2>

      {message ? (
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      ) : null}

      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
