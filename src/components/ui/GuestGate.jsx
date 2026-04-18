import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Button from '../ui/Button'

const GATE_CONTENT = {
  groups: {
    emoji: '👥',
    title: 'Join the conversation',
    perks: [
      'Create and join interest-based groups',
      'Chat with people who share your passions',
      'Private groups for close communities',
      'React, reply, and connect',
    ],
  },
  collections: {
    emoji: '📁',
    title: 'Save your web',
    perks: [
      'Organise URLs into named collections',
      'Public or private visibility',
      'Up to 8 collections, 10 URLs each',
      'Access from any device',
    ],
  },
  settings: {
    emoji: '⚙️',
    title: 'Make it yours',
    perks: [
      'Edit your profile and bio',
      'Control your privacy settings',
      'Manage notifications',
      'Theme and appearance options',
    ],
  },
  dms: {
    emoji: '💬',
    title: 'Private messages',
    perks: [
      'Direct message anyone on Skysurf',
      'Full conversation history',
      'Read receipts and reactions',
      'Reply to specific messages',
    ],
  },
  chat: {
    emoji: '🌐',
    title: 'Join the chat',
    perks: [
      'Send messages on any page you visit',
      'React and reply to others',
      'Start direct conversations',
      'Your identity across the web',
    ],
  },
}

export default function GuestGate({ section = 'groups', back }) {
  const navigate = useNavigate()
  const content  = GATE_CONTENT[section] || GATE_CONTENT.groups

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top gradient strip */}
      <div
        className="flex-shrink-0 h-1.5"
        style={{ background: 'linear-gradient(90deg,#06558D,#1B76B8,#FF3D00)' }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="mb-6"
        >
          {/* Lock badge over emoji */}
          <div className="relative inline-block">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto"
              style={{ background: 'linear-gradient(135deg,#06558D15,#1B76B820)' }}
            >
              {content.emoji}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center shadow-card">
              <Lock size={14} className="text-white" strokeWidth={2.5} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-black text-gray-900 mb-1">{content.title}</h2>
          <p className="text-sm text-brand-mute mb-6 leading-relaxed">
            Sign in or create a free account to unlock this.
          </p>
        </motion.div>

        {/* Perks list */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.18 }}
          className="w-full bg-brand-surface border border-brand-border rounded-2xl p-4 mb-6 text-left"
        >
          {content.perks.map((perk, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <span className="w-5 h-5 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
                <span className="text-brand-orange text-[10px] font-black">✓</span>
              </span>
              <span className="text-sm text-gray-700 font-semibold">{perk}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.24 }}
          className="w-full flex flex-col gap-2.5"
        >
          <Button onClick={() => navigate('/signup')} size="lg">
            Create Free Account
          </Button>
          <Button variant="outline" onClick={() => navigate('/signin')} size="lg">
            Sign In
          </Button>
          {back && (
            <button
              onClick={() => navigate(back)}
              className="text-xs text-brand-mute font-semibold py-1 hover:text-brand-deep transition-colors"
            >
              ← Go back
            </button>
          )}
        </motion.div>
      </div>

      {/* Bottom hint */}
      <div className="px-6 pb-6 text-center">
        <p className="text-[10px] text-brand-mute">
          Guest access: <span className="font-bold text-brand-deep">Global Chat (read-only)</span> · No sign-up required to browse
        </p>
      </div>
    </div>
  )
}
