import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Lock, Globe, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from '../../components/layout/TopBar'
import BottomNav from '../../components/layout/BottomNav'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Tag } from '../../components/ui/Tag'
import { toast } from '../../components/ui/Toast'
import useGroupStore from '../../store/groupStore'
import useAuthStore from '../../store/authStore'
import GuestGate from '../../components/layout/GuestGate'
import { timeAgo } from '../../utils/time'

const EMOJI_OPTIONS = ['💬','⚛️','🎨','🚀','🤖','🔌','🛠️','📚','🎮','🌍','🧠','❤️','🏆','🎯','🔬','🎵']
const MAX_GROUPS = 10

function GroupCard({ group, onNavigate, onJoin, onLeave, currentUserId }) {
  const isMember = group.members?.includes(currentUserId)
  const lastMsg  = group.messages[group.messages.length - 1]
  const isFull   = group.memberCount >= 67

  return (
    <motion.div layout className="border border-brand-border rounded-2xl mb-2.5 overflow-hidden hover:border-brand-mid transition-colors">
      <button onClick={() => onNavigate(`/groups/${group.id}`)} className="w-full flex items-center gap-3 p-3.5 text-left">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#06558D,#1B76B8)' }}>
          {group.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-extrabold text-sm text-gray-900 truncate">{group.name}</span>
            {group.isPublic ? <Globe size={11} className="text-brand-mute flex-shrink-0"/> : <Lock size={11} className="text-brand-mute flex-shrink-0"/>}
            {isFull && <Tag variant="red" className="text-[9px]">FULL</Tag>}
          </div>
          <p className="text-xs text-brand-mute truncate">{group.description || 'No description'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-brand-mid font-bold">{group.memberCount} members</span>
            {lastMsg && <span className="text-[10px] text-brand-mute">· {timeAgo(lastMsg.time)}</span>}
          </div>
        </div>
        {isMember ? (
          <button
            onClick={e => { e.stopPropagation(); onLeave(group.id) }}
            className="text-[10px] font-bold text-brand-mute border border-brand-border rounded-full px-2.5 py-1 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors flex-shrink-0">
            Leave
          </button>
        ) : (
          <button
            onClick={e => { e.stopPropagation(); isFull ? toast.error('This group is full (67/67)') : onJoin(group.id) }}
            className={`text-[10px] font-bold rounded-full px-2.5 py-1 transition-colors flex-shrink-0 ${isFull ? 'text-brand-mute border border-brand-border cursor-not-allowed' : 'text-white bg-brand-orange border border-brand-orange hover:bg-brand-orange-light'}`}>
            {isFull ? 'Full' : 'Join'}
          </button>
        )}
      </button>
    </motion.div>
  )
}

export default function GroupsPage() {
  const navigate = useNavigate()
  const { groups, createGroup, joinGroup, leaveGroup } = useGroupStore()
  const { user, isAuthenticated } = useAuthStore()

  const [tab,    setTab]    = useState('joined')

  if (!isAuthenticated) return <GuestGate feature="groups" />
  const [search, setSearch] = useState('')
  const [showCreate, setCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', emoji: '💬', isPublic: true })
  const [formErr, setFormErr] = useState('')
  const [creating, setCreating] = useState(false)

  const allGroups     = Object.values(groups)
  const joined        = allGroups.filter(g => g.members?.includes(user?.id))
  const discover      = allGroups.filter(g => !g.members?.includes(user?.id))
  const displayedRaw  = tab === 'joined' ? joined : discover
  const displayed     = search
    ? displayedRaw.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || g.description?.toLowerCase().includes(search.toLowerCase()))
    : displayedRaw

  const handleCreate = () => {
    setFormErr('')
    if (!form.name.trim())    return setFormErr('Group name is required')
    if (form.name.length < 3) return setFormErr('Name must be at least 3 characters')
    if (form.name.length > 40) return setFormErr('Name too long (max 40 characters)')
    if (!isAuthenticated)     return navigate('/signin')

    setCreating(true)
    setTimeout(() => {
      const id = createGroup({ ...form, currentUserId: user.id })
      setCreate(false)
      setForm({ name: '', description: '', emoji: '💬', isPublic: true })
      setCreating(false)
      toast.success(`Group "${form.name}" created!`)
      navigate(`/groups/${id}`)
    }, 600)
  }

  const handleJoin = (groupId) => {
    if (!isAuthenticated) return navigate('/signin')
    joinGroup(groupId, user.id)
    toast.success('Joined group!')
  }

  const handleLeave = (groupId) => {
    const g = groups[groupId]
    if (g?.admins?.includes(user?.id) && g.members?.length === 1) {
      return toast.error('You are the only admin. Transfer admin or delete the group first.')
    }
    leaveGroup(groupId, user.id)
    toast.info('You left the group')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title="Groups"
        right={
          <button onClick={() => isAuthenticated ? setCreate(true) : navigate('/signin')}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Plus size={18}/>
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-brand-border flex-shrink-0">
        {[
          { key: 'joined',   label: `Joined (${joined.length})` },
          { key: 'discover', label: `Discover (${discover.length})` },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex-1 py-2.5 text-xs font-bold transition-colors border-b-2 -mb-px ${tab === key ? 'border-brand-orange text-brand-orange' : 'border-transparent text-brand-mute'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-brand-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-lg px-2.5 py-1.5">
          <Search size={13} className="text-brand-mute flex-shrink-0"/>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search groups…"
            className="flex-1 text-xs font-medium bg-transparent outline-none text-gray-800 placeholder:text-brand-mute"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-3">
        {displayed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-brand-mute gap-2">
            <span className="text-4xl">{search ? '🔍' : '👥'}</span>
            <p className="font-bold text-sm">
              {search ? `No groups matching "${search}"` : tab === 'joined' ? 'No groups joined yet' : 'No groups to discover'}
            </p>
            {tab === 'joined' && !search && (
              <button onClick={() => setTab('discover')} className="text-brand-orange text-xs font-bold mt-1">Explore groups →</button>
            )}
          </div>
        )}
        {displayed.map((group, i) => (
          <motion.div key={group.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <GroupCard
              group={group}
              onNavigate={navigate}
              onJoin={handleJoin}
              onLeave={handleLeave}
              currentUserId={user?.id}
            />
          </motion.div>
        ))}
      </div>

      <BottomNav/>

      {/* Create Group Modal */}
      <Modal open={showCreate} onClose={() => { setCreate(false); setFormErr('') }} title="Create a Group">
        <div className="px-5 py-4 flex flex-col gap-4">
          {/* Emoji picker */}
          <div>
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button key={e} type="button" onClick={() => setForm(f => ({ ...f, emoji: e }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-colors ${form.emoji === e ? 'border-brand-orange bg-brand-orange-pale' : 'border-brand-border bg-brand-surface hover:border-brand-mid'}`}>
                  {e}
                </button>
              ))}
            </div>
          </div>

          <Input label="Group Name" placeholder="e.g. React Builders"
            value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} error={formErr}
            note={`${form.name.length}/40 characters`}/>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide">Description <span className="text-brand-mute normal-case font-normal">(optional)</span></label>
            <textarea rows={2} placeholder="What is this group about?"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-light resize-none"/>
            <span className="text-[10px] text-brand-mute text-right">{form.description.length}/200</span>
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-2">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: true,  label: 'Public',  Icon: Globe, desc: 'Anyone can find & join' },
                { value: false, label: 'Private', Icon: Lock,  desc: 'Invite only' },
              ].map(({ value, label, Icon, desc }) => (
                <button key={label} type="button" onClick={() => setForm(f => ({ ...f, isPublic: value }))}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${form.isPublic === value ? 'border-brand-orange bg-brand-orange-pale' : 'border-brand-border hover:border-brand-mid'}`}>
                  <Icon size={16} className={form.isPublic === value ? 'text-brand-orange' : 'text-brand-mute'}/>
                  <span className={`text-xs font-bold ${form.isPublic === value ? 'text-brand-orange' : 'text-gray-700'}`}>{label}</span>
                  <span className="text-[10px] text-brand-mute">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleCreate} disabled={creating} size="lg">
            {creating ? 'Creating…' : 'Create Group'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
