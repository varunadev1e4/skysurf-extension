import { useState } from 'react'
import { Plus, X, Camera } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Toggle } from '../../components/ui/Tag'
import { toast } from '../../components/ui/Toast'
import useAuthStore from '../../store/authStore'
import useSocialStore from '../../store/socialStore'

const MAX_LINKS = 4
const MAX_BIO   = 250

const PRONOUNS = ['He/Him','She/Her','They/Them','Ze/Zir','Any','Prefer not to say']

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuthStore()
  const { acceptDMs, setAcceptDMs } = useSocialStore()

  const [displayName, setName]    = useState(user?.displayName || '')
  const [bio,         setBio]     = useState(user?.bio || '')
  const [pronoun,     setPronoun] = useState('')
  const [links,       setLinks]   = useState(user?.links || [])
  const [newLink,     setNewLink] = useState('')
  const [linkError,   setLinkErr] = useState('')
  const [onlineStatus, setOnline] = useState(true)
  const [saved,       setSaved]   = useState(false)

  const handleSave = () => {
    if (bio.length > MAX_BIO) return toast.error(`Bio exceeds ${MAX_BIO} character limit`)
    updateProfile({ displayName: displayName.trim(), bio: bio.trim(), links })
    setSaved(true)
    toast.success('Profile saved!')
    setTimeout(() => setSaved(false), 2500)
  }

  const addLink = () => {
    setLinkErr('')
    const raw = newLink.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!raw)                   return setLinkErr('Enter a URL')
    if (!raw.includes('.'))     return setLinkErr('Enter a valid URL (e.g. github.com)')
    if (links.length >= MAX_LINKS) return setLinkErr('Maximum 4 links allowed')
    if (links.includes(raw))    return setLinkErr('This link is already added')
    setLinks(l => [...l, raw])
    setNewLink('')
    toast.success('Link added')
  }

  const removeLink = (i) => setLinks(l => l.filter((_, idx) => idx !== i))

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Profile Settings" back="/settings" />
      <div className="flex-1 overflow-y-auto thin-scroll px-5 py-5 space-y-5">

        {/* Avatar / Photo */}
        <section className="flex items-center gap-4 pb-5 border-b border-brand-border">
          <div className="relative">
            <Avatar userId={user?.id} size={72} />
            <button
              onClick={() => toast.info('Photo upload coming in v1.1!')}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-card hover:bg-brand-orange-light transition-colors"
              title="Change photo"
            >
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="font-extrabold text-gray-900">{user?.displayName}</p>
            <p className="text-xs text-brand-mute">@{user?.username}</p>
            <p className="text-xs text-brand-mute mt-0.5 italic">Username cannot be changed.</p>
          </div>
        </section>

        {/* Display name */}
        <Input
          label="Display Name"
          value={displayName}
          onChange={e => setName(e.target.value)}
          placeholder="Your display name"
          maxLength={40}
          note={`${displayName.length}/40`}
        />

        {/* Pronouns */}
        <div>
          <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-2">Pronouns</label>
          <div className="flex flex-wrap gap-2">
            {PRONOUNS.map(p => (
              <button key={p} onClick={() => setPronoun(p === pronoun ? '' : p)}
                className={`text-xs font-bold rounded-full px-3 py-1.5 border-2 transition-colors ${pronoun === p ? 'border-brand-orange bg-brand-orange-pale text-brand-orange' : 'border-brand-border text-brand-mute hover:border-brand-mid'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide">Bio</label>
            <span className={`text-[10px] font-bold ${bio.length > MAX_BIO ? 'text-red-500' : 'text-brand-mute'}`}>{bio.length}/{MAX_BIO}</span>
          </div>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            placeholder="Tell people about yourself…"
            className={`w-full border rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all resize-none ${bio.length > MAX_BIO ? 'border-red-400' : 'border-brand-border focus:border-brand-mid focus:ring-2 focus:ring-brand-light'}`} />
          {bio.length > MAX_BIO && <p className="text-xs text-red-500 font-semibold mt-1">Bio is {bio.length - MAX_BIO} characters over the limit.</p>}
        </div>

        {/* Online status */}
        <div className="flex items-center justify-between py-3 border-y border-brand-border">
          <div>
            <p className="text-sm font-bold text-gray-800">Online Status</p>
            <p className="text-xs text-brand-mute">Show others when you're active</p>
          </div>
          <Toggle on={onlineStatus} onChange={() => { setOnline(s => !s); toast.info(!onlineStatus ? 'Online status visible' : 'Appearing offline') }} />
        </div>

        {/* Links */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide">Links</label>
            <span className="text-[10px] font-bold text-brand-mute">{links.length}/{MAX_LINKS}</span>
          </div>
          <div className="space-y-2 mb-2">
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input value={link} onChange={e => setLinks(l => l.map((v, idx) => idx === i ? e.target.value : v))}
                  className="flex-1 border border-brand-border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-light" />
                <button onClick={() => removeLink(i)} className="text-brand-mute hover:text-red-500 transition-colors p-1"><X size={16} /></button>
              </div>
            ))}
          </div>
          {links.length < MAX_LINKS ? (
            <div className="flex gap-2">
              <input placeholder="Add link (e.g. github.com/you)" value={newLink}
                onChange={e => setNewLink(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLink()}
                className={`flex-1 border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-light ${linkError ? 'border-red-400' : 'border-brand-border'}`} />
              <button onClick={addLink} className="bg-brand-orange text-white font-bold text-sm rounded-lg px-3 py-2 hover:bg-brand-orange-light transition-colors">
                <Plus size={16} />
              </button>
            </div>
          ) : (
            <p className="text-xs text-brand-mute font-semibold border-2 border-dashed border-brand-border rounded-lg p-2 text-center">Maximum 4 links reached</p>
          )}
          {linkError && <p className="text-xs text-red-500 font-semibold mt-1">{linkError}</p>}
        </div>

        <div className="h-2" />
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-brand-border">
        <Button onClick={handleSave} disabled={bio.length > MAX_BIO} size="lg">Save Changes</Button>
      </div>
    </div>
  )
}
