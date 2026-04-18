import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../../components/ui/Button'
import TopBar from '../../components/layout/TopBar'
import { toast } from '../../components/ui/Toast'
import useAuthStore from '../../store/authStore'

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [cooldown,   setCooldown]   = useState(60)
  const [linkExpired, setExpired]   = useState(false)
  const [verified,    setVerified]  = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleResend = () => {
    if (cooldown > 0) return
    setCooldown(60)
    toast.success('Verification email resent!')
  }

  const handleSimulateExpired = () => setExpired(true)
  const handleSimulateVerified = () => {
    setVerified(true)
    setTimeout(() => navigate('/signin'), 1800)
  }

  if (verified) return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Email Verified" />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-300 flex items-center justify-center text-4xl mb-4 mx-auto">✅</div>
          <h2 className="text-xl font-black text-gray-900 mb-1">Email verified!</h2>
          <p className="text-sm text-brand-mute">Redirecting you to sign in…</p>
        </motion.div>
      </div>
    </div>
  )

  if (linkExpired) return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Link Expired" />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <span className="text-5xl">⏰</span>
        <h2 className="text-xl font-black text-gray-900">Verification link expired</h2>
        <p className="text-sm text-brand-mute leading-relaxed max-w-xs">
          This link is no longer valid. Verification links expire after 24 hours.
        </p>
        <div className="w-full space-y-2 mt-4">
          <Button onClick={() => { setExpired(false); setCooldown(0) }}>Resend Verification Email</Button>
          <Button variant="ghost" onClick={() => navigate('/signin')}>Back to Sign In</Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Verify Email" />
      <div className="flex-1 overflow-y-auto thin-scroll px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-3xl mb-4">✉️</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Check your inbox</h2>
          <p className="text-sm text-brand-mute leading-relaxed mb-1">
            We sent a verification link to
          </p>
          <p className="text-sm font-bold text-gray-900 mb-6">
            {user?.username ? `your registered email` : 'your email address'}
          </p>

          {/* Info box */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-4 w-full text-left mb-6 space-y-2">
            <p className="text-xs text-brand-mute flex items-center gap-2"><span>⏳</span> Link expires in <strong>24 hours</strong></p>
            <p className="text-xs text-brand-mute flex items-center gap-2"><span>📬</span> Check your spam / junk folder</p>
            <p className="text-xs text-brand-mute flex items-center gap-2"><span>🔁</span> Didn't get it? Resend below</p>
          </div>

          <div className="w-full space-y-3">
            {/* Demo buttons to test states */}
            <Button onClick={handleSimulateVerified} size="lg">
              ✓ I've verified my email
            </Button>
            <button
              onClick={handleResend}
              disabled={cooldown > 0}
              className={`w-full text-sm font-bold py-2 transition-colors ${cooldown > 0 ? 'text-brand-mute cursor-not-allowed' : 'text-brand-orange hover:underline'}`}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
            </button>
            <button
              onClick={handleSimulateExpired}
              className="w-full text-xs text-brand-mute hover:text-brand-deep transition-colors py-1"
            >
              Simulate: link expired →
            </button>
            <button onClick={() => navigate('/signin')} className="w-full text-sm text-brand-mute hover:text-brand-deep transition-colors">
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
