import { useState } from 'react'
import { Eye, Lock, Shield, Monitor } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import { Toggle } from '../../components/ui/Tag'
import { toast } from '../../components/ui/Toast'
import useSocialStore from '../../store/socialStore'
import { USERS } from '../../data/dummy'

const OLD_PASSWORD = 'current_demo_pass'

const FAKE_SESSIONS = [
  { id: 's1', device: 'Chrome · Windows 11',   location: 'Warangal, IN', time: 'Active now',   current: true },
  { id: 's2', device: 'Safari · iPhone 15',     location: 'Hyderabad, IN', time: '2 hours ago', current: false },
  { id: 's3', device: 'Firefox · MacBook Pro',  location: 'Mumbai, IN',    time: '3 days ago',  current: false },
]

export default function PrivacySettingsPage() {
  const navigate = useNavigate()
  const { blocked, unblockUser } = useSocialStore()

  const [settings, setSettings] = useState({
    online: true, acceptDM: true, profileVis: 'All', groupAdd: true, friendsVis: 'Friends',
  })
  const [pw, setPw]     = useState({ current: '', next: '', confirm: '' })
  const [pwError, setPwError]   = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [showPw, setShowPw]     = useState(false)
  const [sessions, setSessions] = useState(FAKE_SESSIONS)

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }))

  const handlePwSave = () => {
    setPwError('')
    if (!pw.current)                    return setPwError('Enter your current password')
    if (pw.next.length < 8)             return setPwError('Minimum 8 characters required')
    if (!/[A-Z]/.test(pw.next))         return setPwError('Must include at least 1 uppercase letter')
    if (!/[a-z]/.test(pw.next))         return setPwError('Must include at least 1 lowercase letter')
    if (!/[^a-zA-Z0-9]/.test(pw.next)) return setPwError('Must include at least 1 special character')
    if (!/\d/.test(pw.next))            return setPwError('Must include at least 1 number')
    if (pw.next === OLD_PASSWORD || pw.current === pw.next)
                                        return setPwError('New password cannot be the same as your current password')
    if (pw.next !== pw.confirm)         return setPwError('Passwords do not match')
    setPwSuccess(true)
    setPw({ current: '', next: '', confirm: '' })
    toast.success('Password updated successfully!')
    setTimeout(() => setPwSuccess(false), 3000)
  }

  const revokeSession = (id) => {
    setSessions(s => s.filter(ses => ses.id !== id))
    toast.info('Session revoked')
  }

  const revokeAll = () => {
    setSessions(s => s.filter(ses => ses.current))
    toast.info('All other sessions logged out')
  }

  const srow = (label, sub, key) => (
    <div className="flex items-center justify-between py-3 border-b border-brand-border last:border-0">
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {sub && <p className="text-xs text-brand-mute mt-0.5">{sub}</p>}
      </div>
      <Toggle on={settings[key]} onChange={() => { toggle(key); toast.info(`${label} ${!settings[key] ? 'enabled' : 'disabled'}`) }} />
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Privacy & Security" back="/settings" />
      <div className="flex-1 overflow-y-auto thin-scroll px-5 py-4 space-y-5">

        {/* Visibility */}
        <section>
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2 flex items-center gap-1.5"><Eye size={11} /> Visibility</p>
          <div className="bg-brand-surface border border-brand-border rounded-2xl px-4">
            {srow('Show Online Status', 'Others can see when you\'re active', 'online')}
            {srow('Accept DM Requests', 'Allow others to DM you', 'acceptDM')}
            {srow('Allow Group Invites', 'Let others add you to groups', 'groupAdd')}
          </div>
        </section>

        {/* Profile visibility */}
        <section>
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2">Profile Visibility</p>
          <div className="grid grid-cols-3 gap-2">
            {['All','Friends','Nobody'].map(v => (
              <button key={v} onClick={() => { setSettings(s => ({ ...s, profileVis: v })); toast.info(`Profile visible to: ${v}`) }}
                className={`py-2 text-xs font-bold rounded-xl border-2 transition-colors ${settings.profileVis === v ? 'border-brand-deep bg-brand-light text-brand-deep' : 'border-brand-border text-brand-mute hover:border-brand-mid'}`}>
                {v}
              </button>
            ))}
          </div>
        </section>

        {/* Friends list visibility */}
        <section>
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2">Following List Visibility</p>
          <div className="grid grid-cols-3 gap-2">
            {['All','Friends','Nobody'].map(v => (
              <button key={v} onClick={() => setSettings(s => ({ ...s, friendsVis: v }))}
                className={`py-2 text-xs font-bold rounded-xl border-2 transition-colors ${settings.friendsVis === v ? 'border-brand-deep bg-brand-light text-brand-deep' : 'border-brand-border text-brand-mute hover:border-brand-mid'}`}>
                {v}
              </button>
            ))}
          </div>
        </section>

        {/* Blocked accounts */}
        <section>
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2 flex items-center gap-1.5"><Shield size={11} /> Blocked Accounts ({blocked.length})</p>
          {blocked.length === 0 ? (
            <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 text-center">
              <p className="text-xs text-brand-mute">You haven't blocked anyone.</p>
            </div>
          ) : (
            <div className="bg-brand-surface border border-brand-border rounded-2xl px-4">
              {blocked.map((uid, i) => {
                const u = USERS[uid] || { displayName: uid, username: uid }
                return (
                  <div key={uid} className={`flex items-center gap-3 py-3 ${i < blocked.length - 1 ? 'border-b border-brand-border' : ''}`}>
                    <Avatar userId={uid} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{u.displayName}</p>
                      <p className="text-xs text-brand-mute">@{u.username}</p>
                    </div>
                    <button onClick={() => { unblockUser(uid); toast.success(`${u.displayName} unblocked`) }}
                      className="text-xs font-bold text-brand-orange border border-brand-orange rounded-full px-3 py-1 hover:bg-brand-orange-pale transition-colors flex-shrink-0">
                      Unblock
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Change Password */}
        <section>
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2 flex items-center gap-1.5"><Lock size={11} /> Change Password</p>
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Input label="Current Password" type={showPw ? 'text' : 'password'} placeholder="••••••••"
                value={pw.current} onChange={e => setPw(p => ({ ...p, current: e.target.value }))} />
            </div>
            <Input label="New Password" type="password" placeholder="Min 8 characters"
              value={pw.next} onChange={e => setPw(p => ({ ...p, next: e.target.value }))} />
            <Input label="Confirm New Password" type="password" placeholder="Re-enter"
              value={pw.confirm} onChange={e => setPw(p => ({ ...p, confirm: e.target.value }))} error={pwError} />
            {pwSuccess && <p className="text-sm text-green-600 font-bold text-center">✓ Password updated!</p>}
            <Button onClick={handlePwSave}>Update Password</Button>
          </div>
        </section>

        {/* Login Activity */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider flex items-center gap-1.5"><Monitor size={11} /> Login Activity</p>
            {sessions.filter(s => !s.current).length > 0 && (
              <button onClick={revokeAll} className="text-[10px] font-bold text-red-500 hover:underline">Logout All Devices</button>
            )}
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-2xl px-4">
            {sessions.map((ses, i) => (
              <div key={ses.id} className={`flex items-start gap-3 py-3 ${i < sessions.length - 1 ? 'border-b border-brand-border' : ''}`}>
                <div className="w-8 h-8 rounded-lg bg-white border border-brand-border flex items-center justify-center flex-shrink-0">
                  <Monitor size={14} className="text-brand-mute" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900">{ses.device}</p>
                  <p className="text-[10px] text-brand-mute">{ses.location} · {ses.time}</p>
                </div>
                {ses.current
                  ? <span className="text-[10px] font-bold text-green-600 flex-shrink-0">This device</span>
                  : <button onClick={() => revokeSession(ses.id)} className="text-[10px] font-bold text-red-500 hover:underline flex-shrink-0">Revoke</button>
                }
              </div>
            ))}
          </div>
        </section>

        <div className="h-4" />
      </div>
    </div>
  )
}
