export function Tag({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-brand-light text-brand-deep border-brand-border',
    orange:  'bg-brand-orange-pale text-brand-orange border-orange-200',
    green:   'bg-green-50 text-green-700 border-green-200',
    red:     'bg-red-50 text-red-600 border-red-200',
    blue:    'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <span className={`inline-flex items-center gap-1 border rounded-full px-2.5 py-0.5 text-xs font-bold ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}

export function Toggle({ on, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${on ? 'bg-brand-orange' : 'bg-gray-200'}`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0.5'}`}
      />
    </button>
  )
}

export function Badge({ count }) {
  if (!count) return null
  return (
    <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
      {count > 9 ? '9+' : count}
    </span>
  )
}

export function Divider({ label }) {
  return (
    <div className="flex items-center gap-3 my-3">
      <div className="flex-1 h-px bg-brand-border" />
      {label && <span className="text-xs text-brand-mute font-semibold">{label}</span>}
      {label && <div className="flex-1 h-px bg-brand-border" />}
    </div>
  )
}
