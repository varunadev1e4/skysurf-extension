import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { toast } from '../../components/ui/Toast'

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: '8+ chars',   ok: password.length >= 8 },
    { label: 'Uppercase',  ok: /[A-Z]/.test(password) },
    { label: 'Lowercase',  ok: /[a-z]/.test(password) },
    { label: 'Number',     ok: /\d/.test(password) },
    { label: 'Special',    ok: /[^a-zA-Z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const bar   = score <= 1 ? 'bg-red-400' : score <= 3 ? 'bg-amber-400' : 'bg-green-500'
  const label = score <= 1 ? 'Weak' : score <= 3 ? 'Fair' : score < 5 ? 'Good' : 'Strong'
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= score ? bar : 'bg-brand-border'}`} />
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex flex-wrap gap-2">
          {checks.map(c => (
            <span key={c.label} className={`text-[9px] font-bold ${c.ok ? 'text-green-600' : 'text-brand-mute'}`}>
              {c.ok ? '✓ ' : '○ '}{c.label}
            </span>
          ))}
        </div>
        <span className={`text-[10px] font-black ${bar.replace('bg-', 'text-')}`}>{label}</span>
      </div>
    </div>
  )
}

const STEPS = ['enter-email', 'email-sent', 'new-password', 'success']

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step,       setStep]    = useState('enter-email')
  const [email,      setEmail]   = useState('')
  const [newPw,      setNewPw]   = useState('')
  const [confirmPw,  setConfirm] = useState('')
  const [showPw,     setShowPw]  = useState(false)
  const [error,      setError]   = useState('')
  const [loading,    setLoading] = useState(false)
  const [cooldown,   setCooldown] = useState(0)

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const OLD_PASSWORD = 'demo_old_pass' // simulated previous password

  const handleSendLink = () => {
    setError('')
    if (!email.trim())                            return setError('Enter your email address')
    if (!email.includes('@') || !email.includes('.')) return setError('Enter a valid email address')
    setLoading(true)
    setTimeout(() => {
      setStep('email-sent')
      setCooldown(60)
      setLoading(false)
    }, 700)
  }

  const handleResend = () => {
    if (cooldown > 0) return
    setCooldown(60)
    toast.success('Reset link resent!')
  }

  const handleSetPassword = () => {
    setError('')
    if (newPw.length < 8)           return setError('Minimum 8 characters required')
    if (!/[A-Z]/.test(newPw))       return setError('Must include at least 1 uppercase letter')
    if (!/[a-z]/.test(newPw))       return setError('Must include at least 1 lowercase letter')
    if (!/[^a-zA-Z0-9]/.test(newPw)) return setError('Must include at least 1 special character')
    if (!/\d/.test(newPw))          return setError('Must include at least 1 number')
    if (newPw === OLD_PASSWORD)      return setError('New password cannot be the same as your old password')
    if (newPw !== confirmPw)         return setError('Passwords do not match')
    setLoading(true)
    setTimeout(() => { setStep('success'); setLoading(false) }, 700)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title="Forgot Password"
        back={step === 'enter-email' || step === 'success' ? '/signin' : undefined}
      />

      <div className="flex-1 overflow-y-auto thin-scroll px-6 py-6">
        <AnimatePresence mode="wait">

          {/* Step 1 — Enter email */}
          {step === 'enter-email' && (
            <motion.div key="email" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }}>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Reset password</h2>
              <p className="text-sm text-brand-mute mb-6 leading-relaxed">
                Enter the email associated with your account and we'll send you a reset link.
              </p>
              <Input
                label="Email address"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={error}
                autoFocus
              />
              <div className="mt-6">
                <Button onClick={handleSendLink} disabled={loading} size="lg">
                  {loading ? 'Sending…' : 'Send Reset Link →'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2 — Email sent */}
          {step === 'email-sent' && (
            <motion.div key="sent" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }}
              className="flex flex-col items-center text-center pt-4">
              <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center mb-4 text-3xl">
                📨
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-brand-mute leading-relaxed mb-2">
                We sent a reset link to <strong className="text-gray-900">{email}</strong>
              </p>
              <p className="text-xs text-brand-mute mb-8 leading-relaxed">
                The link expires in 24 hours. Check your spam folder if you don't see it.
              </p>

              <div className="w-full space-y-3">
                <Button onClick={() => setStep('new-password')} size="lg">
                  I've clicked the link →
                </Button>
                <button
                  onClick={handleResend}
                  disabled={cooldown > 0}
                  className={`w-full text-sm font-bold py-2 transition-colors ${cooldown > 0 ? 'text-brand-mute cursor-not-allowed' : 'text-brand-orange hover:underline'}`}
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend email'}
                </button>
                <button onClick={() => setStep('enter-email')} className="w-full text-sm text-brand-mute hover:text-brand-deep transition-colors">
                  Use a different email
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3 — New password */}
          {step === 'new-password' && (
            <motion.div key="newpw" initial={{ x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -24, opacity: 0 }}>
              <h2 className="text-2xl font-black text-gray-900 mb-1">New password</h2>
              <p className="text-sm text-brand-mute mb-6">Choose a strong password you haven't used before.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-1">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      autoFocus
                      className="w-full border border-brand-border rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-light pr-14"
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-mute hover:text-brand-deep">
                      {showPw ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <PasswordStrength password={newPw} />
                </div>

                <Input
                  label="Confirm New Password"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPw}
                  onChange={e => setConfirm(e.target.value)}
                  error={error}
                />
              </div>

              <div className="mt-6">
                <Button onClick={handleSetPassword} disabled={loading} size="lg">
                  {loading ? 'Updating…' : 'Set New Password'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4 — Success */}
          {step === 'success' && (
            <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center text-center pt-8">
              <div className="w-20 h-20 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center text-4xl mb-4">
                ✅
              </div>
              <h2 className="text-xl font-black text-gray-900 mb-2">Password updated!</h2>
              <p className="text-sm text-brand-mute mb-8 leading-relaxed">
                Your password has been changed successfully. Sign in with your new password.
              </p>
              <Button onClick={() => navigate('/signin')} size="lg">Go to Sign In →</Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
