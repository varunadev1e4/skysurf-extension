export default function Input({ label, note, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-bold text-brand-mute tracking-wide uppercase">{label}</label>}
      <input
        className={`w-full border rounded-lg px-3 py-2.5 text-sm font-medium text-ink outline-none transition-all duration-200
          ${error
            ? 'border-red-400 focus:ring-2 focus:ring-red-100'
            : 'border-brand-border focus:border-brand-mid focus:ring-2 focus:ring-brand-light'
          }`}
        {...props}
      />
      {note  && !error && <p className="text-xs text-brand-mute">{note}</p>}
      {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  )
}
