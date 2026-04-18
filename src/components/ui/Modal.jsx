import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          {/* Sheet */}
          <motion.div
            className="relative w-full max-w-[430px] bg-white rounded-t-2xl shadow-modal overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 36 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {title && (
              <div className="flex items-center justify-between px-5 py-3 border-b border-brand-border">
                <h2 className="text-base font-bold text-gray-900">{title}</h2>
                <button onClick={onClose} className="w-7 h-7 rounded-full bg-brand-surface flex items-center justify-center text-brand-mute hover:bg-brand-light transition-colors">
                  <span className="text-lg leading-none">×</span>
                </button>
              </div>
            )}

            <div className="max-h-[80dvh] overflow-y-auto thin-scroll">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
