import { create } from 'zustand'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const useToastStore = create((set, get) => ({
  toasts: [],
  add: ({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random()
    set(s => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => get().remove(id), duration)
    return id
  },
  remove: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

export const toast = {
  success: (msg, opts) => useToastStore.getState().add({ message: msg, type: 'success', ...opts }),
  error:   (msg, opts) => useToastStore.getState().add({ message: msg, type: 'error', ...opts }),
  warn:    (msg, opts) => useToastStore.getState().add({ message: msg, type: 'warn', ...opts }),
  info:    (msg, opts) => useToastStore.getState().add({ message: msg, type: 'info', ...opts }),
}

const ICONS = {
  success: <CheckCircle size={15} />,
  error:   <XCircle size={15} />,
  warn:    <AlertTriangle size={15} />,
  info:    <Info size={15} />,
}

const COLORS = {
  success: 'bg-green-50 border-green-300 text-green-800',
  error:   'bg-red-50 border-red-300 text-red-700',
  warn:    'bg-amber-50 border-amber-300 text-amber-800',
  info:    'bg-brand-surface border-brand-border text-brand-deep',
}

const ICON_COLORS = {
  success: 'text-green-500',
  error:   'text-red-500',
  warn:    'text-amber-500',
  info:    'text-brand-mid',
}

export default function ToastContainer() {
  const { toasts, remove } = useToastStore()

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[999] flex flex-col gap-2 items-center pointer-events-none" style={{ width: 'min(360px, 90vw)' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={  { opacity: 0, y: -8,   scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border shadow-card text-xs font-bold pointer-events-auto ${COLORS[t.type]}`}
          >
            <span className={ICON_COLORS[t.type]}>{ICONS[t.type]}</span>
            <span className="flex-1 leading-snug">{t.message}</span>
            <button onClick={() => remove(t.id)} className="opacity-50 hover:opacity-100 transition-opacity">
              <X size={13} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
