import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import useAuthStore from '../../store/authStore'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { USERS } from '../../data/dummy'

const TAKEN_USERNAMES = Object.values(USERS).map(u => u.username)
const COMMON_PASSWORDS = ['password','12345678','qwerty123','letmein1']

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase',     ok: /[A-Z]/.test(password) },
    { label: 'Lowercase',     ok: /[a-z]/.test(password) },
    { label: 'Number',        ok: /\d/.test(password) },
    { label: 'Special char',  ok: /[^a-zA-Z0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const color = score <= 1 ? 'bg-red-400' : score <= 3 ? 'bg-amber-400' : 'bg-green-500'
  const label = score <= 1 ? 'Weak' : score <= 3 ? 'Fair' : score === 4 ? 'Good' : 'Strong'

  if (!password) return null
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= score ? color : 'bg-brand-border'}`}/>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-wrap gap-1.5">
          {checks.map(c => (
            <span key={c.label} className={`text-[9px] font-bold ${c.ok ? 'text-green-600' : 'text-brand-mute'}`}>
              {c.ok ? '✓ ' : '○ '}{c.label}
            </span>
          ))}
        </div>
        <span className={`text-[10px] font-black ${color.replace('bg-','text-')}`}>{label}</span>
      </div>
    </div>
  )
}

const STEPS = ['Email', 'Password', 'Username']

export default function SignUpPage() {
  const navigate = useNavigate()
  const signUp   = useAuthStore(s => s.signUp)

  const [step,    setStep]   = useState(0)
  const [email,   setEmail]  = useState('')
  const [pw,      setPw]     = useState('')
  const [confirm, setConf]   = useState('')
  const [showPw,  setShowPw] = useState(false)
  const [username, setUser]  = useState('')
  const [agreed,  setAgreed] = useState(false)
  const [error,   setError]  = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (e) => {
    if (!e.trim()) return 'Email is required'
    if (!e.includes('@') || !e.includes('.')) return 'Enter a valid email address'
    if (e.endsWith('.con') || e.endsWith('.cmo')) return 'Did you mean .com?'
    return null
  }

  const next = () => {
    setError('')
    if (step === 0) {
      const err = validateEmail(email)
      if (err) return setError(err)
      // Simulate email already taken
      if (email.toLowerCase().includes('taken')) return setError('An account with this email already exists. Try signing in instead.')
      setStep(1)
    } else if (step === 1) {
      if (pw.length < 8)                        return setError('Password must be at least 8 characters')
      if (COMMON_PASSWORDS.includes(pw.toLowerCase())) return setError('This password is too common. Choose something more unique.')
      if (pw !== confirm)                        return setError('Passwords do not match')
      setStep(2)
    } else {
      const u = username.trim()
      if (!u) return setError('Username is required')
      if (u.length < 3) return setError('Username must be at least 3 characters')
      if (u.length > 20) return setError('Username too long (max 20 characters)')
      if (!/^[a-z0-9_]+$/.test(u)) return setError('Only lowercase letters, numbers, and underscores allowed')
      if (TAKEN_USERNAMES.includes(u)) return setError(`@${u} is already taken. Try ${u}_${Math.floor(Math.random()*99)+1} or another name.`)
      if (!agreed) return setError('You must accept the Terms & Conditions to continue')
      setLoading(true)
      setTimeout(() => {
        signUp(email, u, pw)
        navigate('/verify-email', { replace: true })
        setLoading(false)
      }, 700)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Create Account" back={step > 0 ? () => setStep(s => s - 1) : '/'} />
      <div className="flex-1 overflow-y-auto px-6 py-5 thin-scroll flex flex-col">
        {/* Progress */}
        <div className="flex gap-2 mb-4">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-brand-orange' : 'bg-brand-border'}`}/>
          ))}
        </div>
        <p className="text-[10px] font-bold text-brand-mute uppercase tracking-widest mb-1">Step {step+1} of 3</p>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.16 }}>
            <h2 className="text-2xl font-black text-gray-900 mt-1 mb-5">{STEPS[step]}</h2>

            {step === 0 && (
              <Input label="Email address" type="email" placeholder="you@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                note="We'll send a verification link here. Tip: include 'taken' to test the email-exists error."
                error={error} autoFocus/>
            )}

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <div className="relative">
                    <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-1">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} placeholder="Min 8 characters"
                        value={pw} onChange={e => setPw(e.target.value)} autoFocus
                        className="w-full border border-brand-border rounded-lg px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-light pr-12"/>
                      <button type="button" onClick={() => setShowPw(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mute text-xs font-bold">
                        {showPw ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <PasswordStrength password={pw}/>
                  </div>
                </div>
                <Input label="Confirm Password" type="password" placeholder="Re-enter password"
                  value={confirm} onChange={e => setConf(e.target.value)} error={error}/>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <Input label="Username" placeholder="e.g. sky_user99"
                    value={username} onChange={e => setUser(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,''))}
                    note="Letters, numbers, underscores only. Cannot be changed later."
                    error={error} autoFocus/>
                  {username.length >= 3 && !error && (
                    <p className="text-[10px] font-bold text-green-600 mt-1.5 flex items-center gap-1">
                      <CheckCircle size={11}/> @{username} is available
                    </p>
                  )}
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-xl p-3 text-xs text-brand-mute leading-relaxed max-h-24 overflow-y-auto thin-scroll">
                  By creating an account you agree to our Terms of Service and Privacy Policy. You confirm you are at least 13 years of age and agree not to use this platform to harass, spam, or distribute illegal content. Skysurf reserves the right to suspend accounts that violate these terms at any time without notice.
                </div>
                <button type="button" onClick={() => setAgreed(a => !a)}
                  className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                  <span className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-colors ${agreed ? 'bg-brand-orange border-brand-orange' : 'border-brand-border bg-white'}`}>
                    {agreed && <span className="text-white text-xs font-black">✓</span>}
                  </span>
                  I accept the Terms &amp; Conditions
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {error && step === 2 && (
          <p className="text-xs text-red-500 font-semibold mt-3">{error}</p>
        )}
        {error && step === 0 && error.includes('already exists') && (
          <button onClick={() => navigate('/signin')} className="text-xs text-brand-orange font-bold mt-2 hover:underline">
            Sign in instead →
          </button>
        )}

        <div className="mt-auto pt-5 flex flex-col gap-3">
          <Button onClick={next} disabled={loading} size="lg">
            {loading ? 'Creating account…' : step < 2 ? 'Continue →' : 'Create Account'}
          </Button>
          {step === 0 && (
            <p className="text-center text-sm text-brand-mute">
              Already have an account?{' '}
              <button onClick={() => navigate('/signin')} className="text-brand-orange font-bold hover:underline">Sign In</button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
