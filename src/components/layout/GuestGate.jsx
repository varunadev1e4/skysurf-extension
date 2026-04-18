import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Button from '../ui/Button'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

const FEATURE_MAP = {
  dms:         { icon: '💬', title: 'Direct Messages',  desc: 'Send private messages to anyone on Skysurf. Start real conversations beyond the chat.' },
  groups:      { icon: '👥', title: 'Groups',           desc: 'Join interest-based groups, create your own, and chat with people who share your passions.' },
  collections: { icon: '📁', title: 'Collections',      desc: 'Save and organise your favourite URLs into collections you can share or keep private.' },
  settings:    { icon: '⚙️', title: 'Settings',         desc: 'Customise your profile, manage privacy, and control your Skysurf experience.' },
  profile:     { icon: '👤', title: 'Full Profile',     desc: 'View full profiles, follow users, and build your network on Skysurf.' },
  default:     { icon: '🔒', title: 'Members Only',     desc: 'Create an account to unlock everything Skysurf has to offer.' },
}

export default function GuestGate({ feature = 'default', topBarTitle, back }) {
  const navigate = useNavigate()
  const { icon, title, desc } = FEATURE_MAP[feature] || FEATURE_MAP.default

  return (
    <div className="flex flex-col h-full bg-white">
      {topBarTitle && <TopBar title={topBarTitle} back={back} />}

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 12 }}
          animate={{ scale: 1,   opacity: 1, y: 0  }}
          transition={{ type: 'spring', stiffness: 280, damping: 24 }}
          className="flex flex-col items-center gap-4"
        >
          {/* Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg,#06558D18,#1B76B818)', border: '2px solid #E4EAF0' }}>
              {icon}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-brand-deep flex items-center justify-center shadow-card">
              <Lock size={13} className="text-white" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-gray-900 mb-2">{title}</h2>
            <p className="text-sm text-brand-mute leading-relaxed max-w-[240px]">{desc}</p>
          </div>

          {/* Perks */}
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 w-full text-left space-y-2.5">
            {[
              ['💬', 'Chat on any page you visit'],
              ['👥', 'Join and create groups'],
              ['📁', 'Save URLs to collections'],
              ['🔔', 'Get notified about replies'],
            ].map(([e, t]) => (
              <div key={t} className="flex items-center gap-3">
                <span className="text-base leading-none">{e}</span>
                <span className="text-xs font-semibold text-gray-700">{t}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 w-full mt-1">
            <Button onClick={() => navigate('/signup')} size="lg">
              Create Free Account
            </Button>
            <Button variant="outline" onClick={() => navigate('/signin')} size="lg">
              Sign In
            </Button>
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="text-xs text-brand-mute hover:text-brand-deep transition-colors font-semibold"
          >
            Continue as guest (read-only chat only)
          </button>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
