import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Globe, Lock, LogOut, Crown, UserPlus, UserMinus, Trash2, Edit2 } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Tag } from '../../components/ui/Tag'
import { toast } from '../../components/ui/Toast'
import useGroupStore from '../../store/groupStore'
import useAuthStore from '../../store/authStore'
import { USERS } from '../../data/dummy'

export default function GroupInfoPage() {
  const { groupId } = useParams()
  const navigate    = useNavigate()
  const { user }    = useAuthStore()
  const { getGroup, leaveGroup, joinGroup, removeMember, updateGroup, deleteGroup } = useGroupStore()
  const group = getGroup(groupId)

  const [showEdit,   setEdit]   = useState(false)
  const [showTransfer, setTransfer] = useState(false)
  const [transferTo,   setTransferTo] = useState(null)
  const [showDelete, setDelete] = useState(false)
  const [showAddMember, setAddMember] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [editForm, setEditForm] = useState({ name: '', description: '', emoji: '', isPublic: true })
  const [addSearch, setAddSearch] = useState('')

  if (!group) return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Group Info" back />
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center text-brand-mute">
        <span className="text-4xl">💨</span>
        <p className="font-bold text-sm">Group not found</p>
        <p className="text-xs">It may have been deleted.</p>
      </div>
    </div>
  )

  const isMember = group.members?.includes(user?.id)
  const isAdmin  = group.admins?.includes(user?.id)

  const openEdit = () => {
    setEditForm({ name: group.name, description: group.description || '', emoji: group.emoji, isPublic: group.isPublic })
    setEdit(true)
  }

  const handleSaveEdit = () => {
    if (!editForm.name.trim()) return toast.error('Group name is required')
    updateGroup(groupId, { name: editForm.name.trim(), description: editForm.description, emoji: editForm.emoji, isPublic: editForm.isPublic })
    toast.success('Group updated!')
    setEdit(false)
  }

  const handleDelete = () => {
    if (deleteConfirm !== group.name) return toast.error(`Type the group name exactly to confirm`)
    deleteGroup(groupId)
    toast.info(`"${group.name}" deleted`)
    navigate('/groups', { replace: true })
  }

  const handleRemoveMember = (uid) => {
    if (uid === user?.id) return toast.error('Use Leave Group to remove yourself')
    removeMember(groupId, uid)
    toast.info(`${USERS[uid]?.displayName} removed from group`)
  }

  // Members not in group for add-member picker
  const nonMembers = Object.values(USERS).filter(u =>
    !group.members?.includes(u.id) && u.id !== user?.id
  ).filter(u => !addSearch || u.displayName.toLowerCase().includes(addSearch.toLowerCase()) || u.username.includes(addSearch.toLowerCase()))

  const handleAddMember = (uid) => {
    const { addMember } = useGroupStore.getState()
    addMember(groupId, uid)
    toast.success(`${USERS[uid]?.displayName} added to group!`)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title="Group Info"
        back={`/groups/${groupId}`}
        right={
          isAdmin && (
            <button onClick={openEdit} className="text-white/80 hover:text-white transition-colors">
              <Edit2 size={17} />
            </button>
          )
        }
      />

      <div className="flex-1 overflow-y-auto thin-scroll">
        {/* Header */}
        <div className="flex flex-col items-center py-5 px-5 border-b border-brand-border">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2.5"
            style={{ background: 'linear-gradient(135deg,#06558D,#1B76B8)' }}>
            {group.emoji}
          </div>
          <h1 className="text-lg font-black text-gray-900 mb-1">{group.name}</h1>
          <div className="flex items-center gap-2 mb-2">
            <Tag>{group.memberCount} members</Tag>
            <Tag variant={group.isPublic ? 'blue' : 'default'}>
              {group.isPublic ? <><Globe size={9} /> Public</> : <><Lock size={9} /> Private</>}
            </Tag>
            {isAdmin && <Tag variant="orange"><Crown size={9} /> Admin</Tag>}
          </div>
          {group.description && <p className="text-xs text-gray-600 text-center leading-relaxed max-w-[220px]">{group.description}</p>}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-b border-brand-border flex flex-col gap-2">
          {isMember ? (
            <Button variant="danger" onClick={() => {
              if (isAdmin && group.members?.length === 1) return toast.error('You are the only member. Delete the group or add others first.')
              leaveGroup(groupId, user?.id)
              toast.info('You left the group')
              navigate('/groups')
            }}>
              <LogOut size={14} /> Leave Group
            </Button>
          ) : (
            <Button onClick={() => { joinGroup(groupId, user?.id || 'u1'); navigate(`/groups/${groupId}`) }}>
              Join Group
            </Button>
          )}

          {isAdmin && (
            <div className="flex gap-2">
              <Button variant="outline" fullWidth={false} className="flex-1" onClick={() => setAddMember(true)}>
                <UserPlus size={13} /> Add Members
              </Button>
              <Button variant="danger" fullWidth={false} className="flex-1" onClick={() => setDelete(true)}>
                <Trash2 size={13} /> Delete Group
              </Button>
            </div>
          )}
        </div>

        {/* Members */}
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2">
            Members ({group.members?.length || 0})
          </p>
          {(group.members || []).map(uid => {
            const u = USERS[uid] || {}
            const memberIsAdmin = group.admins?.includes(uid)
            return (
              <div key={uid} className="flex items-center gap-2.5 py-2 border-b border-brand-border last:border-0">
                <button onClick={() => navigate(`/profile/${uid}`)} className="flex items-center gap-2.5 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left">
                  <Avatar userId={uid} size={34} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{u.displayName}</p>
                    <p className="text-[10px] text-brand-mute">@{u.username}</p>
                  </div>
                </button>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {memberIsAdmin && <Tag variant="orange" className="text-[9px]"><Crown size={8} /> Admin</Tag>}
                  {u.online && <span className="w-2 h-2 rounded-full bg-green-400" />}
                  {isAdmin && uid !== user?.id && (
                    <button onClick={() => handleRemoveMember(uid)}
                      className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors" title="Remove member">
                      <UserMinus size={12} className="text-red-500" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Edit Group Modal */}
      <Modal open={showEdit} onClose={() => setEdit(false)} title="Edit Group">
        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const emojis = ['💬','⚛️','🎨','🚀','🤖','🔌','🛠️','📚','🎮','🌍','🧠','❤️','🏆','🎯']
                const idx = emojis.indexOf(editForm.emoji)
                setEditForm(f => ({ ...f, emoji: emojis[(idx + 1) % emojis.length] }))
              }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl hover:opacity-80 transition-opacity flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#06558D,#1B76B8)' }}
              title="Tap to change icon"
            >
              {editForm.emoji}
            </button>
            <p className="text-xs text-brand-mute">Tap icon to change it</p>
          </div>

          <Input label="Group Name" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />

          <div>
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-1">Description</label>
            <textarea rows={2} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-light resize-none" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-2">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
              {[{v:true,l:'Public'},{v:false,l:'Private'}].map(({v,l}) => (
                <button key={l} onClick={() => setEditForm(f => ({ ...f, isPublic: v }))}
                  className={`py-2 text-sm font-bold rounded-xl border-2 transition-colors ${editForm.isPublic === v ? 'border-brand-orange bg-brand-orange-pale text-brand-orange' : 'border-brand-border text-brand-mute'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <Button onClick={handleSaveEdit}>Save Changes</Button>
        </div>
      </Modal>

      {/* Delete Group Modal */}
      <Modal open={showDelete} onClose={() => { setDelete(false); setDeleteConfirm('') }} title="Delete Group">
        <div className="px-5 py-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold text-red-700">This will permanently delete "{group.name}" and all its messages. This cannot be undone.</p>
          </div>
          <div className="mb-4">
            <label className="text-xs font-bold text-red-600 uppercase tracking-wide block mb-1.5">
              Type <strong>{group.name}</strong> to confirm
            </label>
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
              placeholder={group.name}
              className={`w-full border-2 rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all ${deleteConfirm === group.name ? 'border-red-400' : 'border-red-100'}`} />
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="danger" onClick={handleDelete} disabled={deleteConfirm !== group.name}>
              <Trash2 size={14} /> Delete Group Permanently
            </Button>
            <Button variant="ghost" onClick={() => { setDelete(false); setDeleteConfirm('') }}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <Modal open={showAddMember} onClose={() => { setAddMember(false); setAddSearch('') }} title="Add Members">
        <div className="px-5 py-4">
          <input value={addSearch} onChange={e => setAddSearch(e.target.value)} placeholder="Search users…"
            className="w-full border border-brand-border rounded-lg px-3 py-2 text-sm font-medium outline-none focus:border-brand-mid mb-3" />
          {nonMembers.length === 0 ? (
            <p className="text-sm text-brand-mute text-center py-4">No users to add{addSearch ? ' matching your search' : ''}.</p>
          ) : (
            <div className="space-y-1">
              {nonMembers.map(u => (
                <div key={u.id} className="flex items-center gap-3 py-2 border-b border-brand-border last:border-0">
                  <Avatar userId={u.id} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{u.displayName}</p>
                    <p className="text-xs text-brand-mute">@{u.username}</p>
                  </div>
                  <button onClick={() => handleAddMember(u.id)}
                    className="text-xs font-bold text-white bg-brand-orange rounded-full px-3 py-1 hover:bg-brand-orange-light transition-colors flex-shrink-0">
                    Add
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Transfer Admin Modal */}
      <Modal open={showTransfer} onClose={() => { setTransfer(false); setTransferTo(null) }} title="Transfer Admin Role">
        <div className="px-5 py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
            <p className="text-xs font-bold text-amber-800">
              You are the only admin. You must assign another member as admin before leaving.
            </p>
          </div>
          <p className="text-xs text-brand-mute mb-3 font-semibold">Choose a member to become admin:</p>
          <div className="space-y-1 mb-4 max-h-48 overflow-y-auto thin-scroll">
            {(group.members || []).filter(uid => uid !== user?.id).map(uid => {
              const u = USERS[uid] || {}
              return (
                <button key={uid}
                  onClick={() => setTransferTo(uid)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border-2 transition-colors text-left
                    ${transferTo === uid ? 'border-brand-orange bg-brand-orange-pale' : 'border-brand-border hover:border-brand-mid'}`}>
                  <Avatar userId={uid} size={32} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{u.displayName}</p>
                    <p className="text-xs text-brand-mute">@{u.username}</p>
                  </div>
                  {transferTo === uid && <span className="ml-auto text-brand-orange font-black">✓</span>}
                </button>
              )
            })}
          </div>
          <div className="flex flex-col gap-2">
            <Button
              disabled={!transferTo}
              onClick={() => {
                if (!transferTo) return
                // Make transferTo an admin, then leave
                updateGroup(groupId, {
                  admins: [...(group.admins || []).filter(id => id !== user?.id), transferTo]
                })
                leaveGroup(groupId, user?.id)
                setTransfer(false)
                toast.success(`${USERS[transferTo]?.displayName} is now admin. You left the group.`)
                navigate('/groups')
              }}
            >
              Transfer & Leave Group
            </Button>
            <Button variant="ghost" onClick={() => { setTransfer(false); setTransferTo(null) }}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
