import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Trash2, PauseCircle, Sun, Moon, Type } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { toast } from '../../components/ui/Toast'
import useAuthStore from '../../store/authStore'

const FONT_SIZES = ['S', 'M', 'L']
const SAMPLE = 'The quick brown fox jumps over the lazy dog.'

export default function AccountSettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  const [theme,      setTheme]      = useState('Light')
  const [fontSize,   setFontSize]   = useState('M')
  const [showDeactivate, setDeactivate] = useState(false)
  const [showDelete,     setDelete]     = useState(false)
  const [deleteConfirm,  setDeleteConf] = useState('')

  const fontClass = { S: 'text-xs', M: 'text-sm', L: 'text-base' }

  const handleDeactivate = () => {
    signOut(); toast.info('Account deactivated. Sign in anytime to reactivate.')
    navigate('/', { replace: true })
  }

  const handleDelete = () => {
    if (deleteConfirm !== 'DELETE') return toast.error('Type DELETE exactly to confirm')
    signOut(); toast.info('Account deleted permanently.')
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Account Settings" back="/settings" />
      <div className="flex-1 overflow-y-auto thin-scroll px-5 py-4 space-y-5">

        {/* Email (view only) */}
        <section>
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2">Email</p>
          <div className="bg-brand-surface border border-brand-border rounded-xl px-4 py-3">
            <p className="text-xs text-brand-mute font-semibold mb-0.5">Registered email</p>
            <p className="text-sm font-bold text-gray-700">{user?.username || 'user'}@skysurf.app</p>
            <p className="text-[10px] text-brand-mute mt-1">Email cannot be changed. Contact support if needed.</p>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2 flex items-center gap-1.5"><Sun size={11} /> Appearance</p>
          <div className="bg-brand-surface border border-brand-border rounded-2xl p-4 space-y-4">
            {/* Theme */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Theme</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { t: 'Light', Icon: Sun },
                  { t: 'Dark',  Icon: Moon },
                ].map(({ t, Icon }) => (
                  <button key={t} onClick={() => { setTheme(t); toast.info(`${t} mode — coming to full release!`) }}
                    className={`flex items-center gap-2 justify-center py-2.5 rounded-xl border-2 transition-colors ${theme === t ? 'border-brand-deep bg-brand-light text-brand-deep' : 'border-brand-border text-brand-mute hover:border-brand-mid'}`}>
                    <Icon size={14} />
                    <span className="text-sm font-bold">{t}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div>
              <p className="text-xs font-bold text-gray-700 mb-2">Font Size</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {FONT_SIZES.map(f => (
                  <button key={f} onClick={() => setFontSize(f)}
                    className={`py-2 text-sm font-bold rounded-xl border-2 transition-colors ${fontSize === f ? 'border-brand-deep bg-brand-light text-brand-deep' : 'border-brand-border text-brand-mute hover:border-brand-mid'}`}>
                    {f}
                  </button>
                ))}
              </div>
              {/* Live preview */}
              <div className="bg-white border border-brand-border rounded-xl p-3">
                <p className="text-[10px] text-brand-mute font-bold mb-1.5">Preview</p>
                <p className={`text-gray-800 leading-relaxed ${fontClass[fontSize]}`}>{SAMPLE}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Danger zone */}
        <section>
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3">
            <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
            <p className="text-xs font-semibold text-amber-800 leading-snug">Actions below are serious. Read each option before proceeding.</p>
          </div>

          <div className="border border-brand-border rounded-2xl p-4 mb-3">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <PauseCircle size={18} className="text-amber-600" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">Deactivate Account</h3>
                <p className="text-xs text-brand-mute leading-relaxed mt-0.5">Hide your profile temporarily. Reactivate by signing in.</p>
              </div>
            </div>
            <div className="bg-brand-surface border border-brand-border rounded-xl p-3 mb-3 space-y-1 text-xs">
              {[['✓','Profile hidden from all users','text-green-600'],['✓','DM history preserved','text-green-600'],['✓','Reactivate anytime','text-green-600'],['!','Removed from active group feeds','text-amber-600']].map(([icon,text,col]) => (
                <div key={text} className="flex items-center gap-2"><span className={`font-black flex-shrink-0 ${col}`}>{icon}</span><span className="text-gray-600">{text}</span></div>
              ))}
            </div>
            <Button variant="outline" onClick={() => setDeactivate(true)}>Deactivate Account</Button>
          </div>

          <div className="border border-red-200 rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Trash2 size={17} className="text-red-500" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-red-700">Delete Account</h3>
                <p className="text-xs text-red-500 leading-relaxed mt-0.5">Permanently delete everything. <strong>Cannot be undone.</strong></p>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-3 space-y-1 text-xs">
              {['Profile and username','All messages','Collections and URLs','Group memberships'].map(item => (
                <div key={item} className="flex items-center gap-2"><span className="text-red-500 font-black">✕</span><span className="text-red-700">{item} permanently deleted</span></div>
              ))}
            </div>
            <Button variant="danger" onClick={() => setDelete(true)}>Delete My Account</Button>
          </div>
        </section>
        <div className="h-4" />
      </div>

      <Modal open={showDeactivate} onClose={() => setDeactivate(false)} title="Deactivate Account?">
        <div className="px-5 py-4">
          <p className="text-sm text-brand-mute mb-4 leading-relaxed">Your profile will be hidden and you'll be signed out. Sign back in at any time to reactivate — all your data is preserved.</p>
          <div className="flex flex-col gap-2">
            <Button onClick={handleDeactivate} variant="outline">Yes, Deactivate</Button>
            <Button variant="ghost" onClick={() => setDeactivate(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal open={showDelete} onClose={() => { setDelete(false); setDeleteConf('') }} title="Delete Account Permanently?">
        <div className="px-5 py-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold text-red-700">⚠ This is permanent and cannot be undone. All data will be erased immediately.</p>
          </div>
          <div className="mb-4">
            <label className="text-xs font-bold text-red-600 uppercase tracking-wide block mb-1.5">Type <strong>DELETE</strong> to confirm</label>
            <input value={deleteConfirm} onChange={e => setDeleteConf(e.target.value)} placeholder="DELETE"
              className={`w-full border-2 rounded-lg px-3 py-2.5 text-sm font-bold outline-none ${deleteConfirm === 'DELETE' ? 'border-red-400 text-red-600' : 'border-red-100 text-gray-800'}`} />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="danger" onClick={handleDelete} disabled={deleteConfirm !== 'DELETE'}>Permanently Delete Account</Button>
            <Button variant="ghost" onClick={() => { setDelete(false); setDeleteConf('') }}>Cancel, Keep My Account</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
