import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function GuestChatBanner({ navigate: nav }) {
  const navigate  = nav || useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) {
    return (
      <div className="flex-shrink-0 border-t border-brand-border bg-brand-surface px-3 py-2">
        <button
          onClick={() => setDismissed(false)}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold text-brand-mute hover:text-brand-deep transition-colors"
        >
          <MessageSquare size={12} />
          Sign in to join the conversation
        </button>
      </div>
    )
  }

  return (
    <div className="flex-shrink-0 border-t border-brand-border bg-white">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 bg-gradient-to-b from-brand-surface to-white border-b border-brand-border">
              <p className="text-xs font-bold text-gray-700 mb-2">As a member you can:</p>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                {[
                  '💬 Send messages',
                  '⚛️ React to messages',
                  '↩️ Reply in threads',
                  '👥 Join groups',
                  '📁 Save collections',
                  '✉️ Direct messages',
                ].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-[11px] text-gray-600 font-semibold">
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="flex-1 bg-brand-orange text-white text-xs font-bold rounded-lg py-2 hover:bg-brand-orange-light transition-colors"
                >
                  Create Free Account
                </button>
                <button
                  onClick={() => navigate('/signin')}
                  className="flex-1 border border-brand-orange text-brand-orange text-xs font-bold rounded-lg py-2 hover:bg-brand-orange-pale transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main collapsed bar */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div
          onClick={() => setExpanded(e => !e)}
          className="flex-1 flex items-center gap-2.5 bg-brand-surface border border-brand-border rounded-full px-4 py-2 cursor-pointer hover:bg-brand-light transition-colors"
        >
          <MessageSquare size={13} className="text-brand-mute flex-shrink-0" />
          <span className="text-xs text-brand-mute font-semibold flex-1">
            {expanded ? 'Sign in to participate…' : 'Join the conversation — sign in or sign up'}
          </span>
          <span className="text-[10px] text-brand-orange font-bold flex-shrink-0">
            {expanded ? '▼' : '▲'}
          </span>
        </div>

        <button
          onClick={() => navigate('/signup')}
          className="bg-brand-orange text-white text-[11px] font-bold rounded-full px-3 py-2 hover:bg-brand-orange-light transition-colors whitespace-nowrap flex-shrink-0"
        >
          Join
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="text-brand-mute hover:text-gray-600 transition-colors flex-shrink-0"
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
