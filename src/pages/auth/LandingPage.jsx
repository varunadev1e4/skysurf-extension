import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Hero */}
      <div
        className="flex flex-col items-center justify-center flex-1 px-8 pt-10 pb-6 text-center"
        style={{ background: 'linear-gradient(180deg,#06558D 0%,#1B76B8 65%,#D6EAF2 100%)' }}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="mb-4"
        >
          <div className="relative w-20 h-20 mx-auto">
            <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
              <rect width="96" height="96" rx="20" fill="url(#grad)" />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#06558D"/>
                  <stop offset="1" stopColor="#1B76B8"/>
                </linearGradient>
              </defs>
              {/* n glyph */}
              <path d="M18 72V30h10v8l2-3c3-5 7-7 13-7 8 0 13 5 13 14v30H46V44c0-4-2-6-6-6s-6 2-6 6v28H18z" fill="white" fillOpacity="0.95"/>
              {/* u glyph */}
              <path d="M56 30h10v24c0 4 3 7 7 7s7-3 7-7V30h0" stroke="white" strokeWidth="9" strokeLinecap="round" fill="none" strokeOpacity="0.95"/>
              {/* spark */}
              <path d="M77 14l2 6h6l-5 4 2 6-5-3-5 3 2-6-5-4h6z" fill="#FF3D00"/>
            </svg>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className="text-3xl font-black text-white tracking-tight mb-2"
        >
          skysurf
        </motion.h1>
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="text-white/80 text-sm font-medium leading-relaxed max-w-[220px]"
        >
          Chat with people browsing the same page as you.
        </motion.p>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.32 }}
        className="px-5 py-5 flex flex-col gap-2.5"
      >
        <Button onClick={() => navigate('/signup')} size="lg">Get Started</Button>
        <Button variant="outline" onClick={() => navigate('/signin')} size="lg">Sign In</Button>
        <button
          onClick={() => navigate('/chat')}
          className="text-xs text-brand-mute font-semibold text-center py-1.5 hover:text-brand-mid transition-colors"
        >
          Continue as guest (read-only)
        </button>
      </motion.div>
    </div>
  )
}
