import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../store/authStore'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Divider } from '../../components/ui/Tag'
import { USERS } from '../../data/dummy'

// Simulated unverified accounts for demo
const UNVERIFIED = ['meera_writes@demo.com']

export default function SignInPage() {
  const navigate = useNavigate()
  const signIn   = useAuthStore(s => s.signIn)

  const [identifier, setIdentifier] = useState('')
  const [password,   setPassword]   = useState('')
  const [showPw,     setShowPw]     = useState(false)
  const [error,      setError]      = useState('')
  const [errorType,  setErrorType]  = useState('')
  const [loading,    setLoading]    = useState(false)
  const [attempts,   setAttempts]   = useState(0)
  const [cooldown,   setCooldown]   = useState(0)
  const [resendSent, setResent]     = useState(false)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleSignIn = () => {
    setError(''); setErrorType('')
    const id = identifier.trim()
    if (!id)       return (setError('Enter your email or username'), setErrorType('identifier'))
    if (!password) return (setError('Enter your password'),           setErrorType('password'))
    if (cooldown > 0) return setError(`Too many attempts. Try again in ${cooldown}s.`)

    setLoading(true)
    setTimeout(() => {
      const isEmail   = id.includes('@')
      const foundUser = isEmail
        ? Object.values(USERS).find(() => true) // any email works in demo
        : Object.values(USERS).find(u => u.username === id)

      // User not found
      if (!isEmail && !foundUser) {
        setAttempts(a => a + 1)
        setError(`No account found for "@${id}". Check spelling or sign up.`)
        setErrorType('not-found')
        setLoading(false)
        return
      }

      // Simulate unverified account (email 'unverified@demo.com')
      if (id.toLowerCase().includes('unverified')) {
        setError('Email not verified. Check your inbox or resend the verification link.')
        setErrorType('unverified')
        setLoading(false)
        return
      }

      // Wrong password (password starting with 'wrong')
      if (password.toLowerCase().startsWith('wrong')) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        if (newAttempts >= 5) {
          setCooldown(30)
          setError('Account temporarily locked. Too many failed attempts. Try again in 30s.')
          setErrorType('locked')
        } else {
          setError(`Incorrect password. ${5 - newAttempts} attempt${5 - newAttempts === 1 ? '' : 's'} remaining before lockout.`)
          setErrorType('password')
        }
        setLoading(false)
        return
      }

      // Success
      signIn(id, password)
      navigate('/chat', { replace: true })
      setLoading(false)
    }, 700)
  }

  const handleResendVerification = () => {
    setResent(true)
    setTimeout(() => setResent(false), 4000)
  }

  const errorStyle = {
    'not-found':  'bg-amber-50 border-amber-300 text-amber-800',
    'password':   'bg-red-50 border-red-200 text-red-600',
    'locked':     'bg-red-50 border-red-300 text-red-700',
    'unverified': 'bg-blue-50 border-blue-300 text-blue-700',
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Sign In" back="/" />
      <div className="flex-1 overflow-y-auto px-6 py-6 thin-scroll flex flex-col">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h2>
          <p className="text-sm text-brand-mute mb-6">Sign in to join the conversation.</p>
        </motion.div>

        <div className="flex flex-col gap-4">
          <Input
            label="Email or Username"
            placeholder="you@email.com or varun_dev"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            error={errorType === 'identifier' ? error : ''}
            autoFocus
          />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide">Password</label>
              <button onClick={() => navigate('/forgot-password')} className="text-xs font-bold text-brand-mid hover:text-brand-orange transition-colors">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSignIn()}
                className={`w-full border rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all pr-14 ${errorType === 'password' || errorType === 'locked' ? 'border-red-400' : 'border-brand-border focus:border-brand-mid focus:ring-2 focus:ring-brand-light'}`}
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-mute hover:text-brand-deep">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Error banners */}
          {error && !['identifier','password'].includes(errorType) && (
            <div className={`border rounded-xl p-3 text-xs font-semibold ${errorStyle[errorType] || 'bg-red-50 border-red-200 text-red-600'}`}>
              {error}
              {errorType === 'unverified' && (
                <div className="mt-2">
                  {resendSent
                    ? <p className="text-blue-600 font-bold">✓ Verification email sent!</p>
                    : <button onClick={handleResendVerification} className="text-blue-700 font-bold underline hover:no-underline">
                        Resend verification email →
                      </button>
                  }
                </div>
              )}
            </div>
          )}

          {/* Demo hint */}
          <div className="bg-brand-surface border border-brand-border rounded-xl p-3 text-xs text-brand-mute leading-relaxed">
            <span className="font-bold text-brand-deep">Demo:</span> Any username (e.g.{' '}
            <code className="font-mono text-brand-orange bg-brand-orange-pale px-1 rounded">varun_dev</code>
            ) with any password. Start password with{' '}
            <code className="font-mono text-brand-orange bg-brand-orange-pale px-1 rounded">wrong</code>
            {' '}to test errors. Use{' '}
            <code className="font-mono text-brand-orange bg-brand-orange-pale px-1 rounded">unverified</code>
            {' '}as username to test unverified state.
          </div>
        </div>

        <div className="mt-auto pt-6 flex flex-col gap-3">
          <Button onClick={handleSignIn} disabled={loading || cooldown > 0} size="lg">
            {loading ? 'Signing in…' : cooldown > 0 ? `Locked — wait ${cooldown}s` : 'Sign In →'}
          </Button>
          <Divider label="or" />
          <p className="text-center text-sm text-brand-mute">
            No account?{' '}
            <button onClick={() => navigate('/signup')} className="text-brand-orange font-bold hover:underline">Create one</button>
          </p>
        </div>
      </div>
    </div>
  )
}
