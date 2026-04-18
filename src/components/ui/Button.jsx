export default function Button({ children, variant = 'primary', size = 'md', onClick, disabled, className = '', type = 'button', fullWidth = true }) {
  const base = `font-bold rounded-lg transition-all duration-150 flex items-center justify-center gap-2 ${fullWidth ? 'w-full' : ''} ${className}`

  const variants = {
    primary:  'bg-brand-orange text-white border border-brand-orange active:scale-[0.98] hover:bg-brand-orange-light disabled:opacity-40',
    outline:  'bg-white text-brand-orange border border-brand-orange hover:bg-brand-orange-pale disabled:opacity-40',
    ghost:    'bg-transparent text-brand-mute border-none hover:bg-brand-surface disabled:opacity-40',
    danger:   'bg-white text-red-600 border border-red-400 hover:bg-red-50 disabled:opacity-40',
    blue:     'bg-brand-deep text-white border border-brand-deep hover:bg-brand-mid disabled:opacity-40',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
