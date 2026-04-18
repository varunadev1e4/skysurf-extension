import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Link2, MessageCircle, UserPlus, UserCheck,
  ShieldOff, Shield, Flag, MoreVertical,
  Clock, CheckCircle, XCircle, Send, BellOff, Bell
} from 'lucide-react'
import { motion } from 'framer-motion'
import TopBar from '../../components/layout/TopBar'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Tag } from '../../components/ui/Tag'
import { toast } from '../../components/ui/Toast'
import useAuthStore from '../../store/authStore'
import useSocialStore from '../../store/socialStore'
import useGroupStore from '../../store/groupStore'
import GuestGate from '../../components/layout/GuestGate'
import useDmStore from '../../store/dmStore'
import { USERS } from '../../data/dummy'

const REPORT_REASONS = [
  'Harassment or bullying',
  'Spam or advertising',
  'Hate speech or discrimination',
  'Impersonation',
  'Sharing inappropriate content',
  'Other',
]

// ── DM Button logic (handles: open DMs / disabled DMs / request flow) ────────
function DmButton({ userId, profileUser, navigate }) {
  const social     = useSocialStore()
  const { user: me } = useAuthStore()
  const convos     = useDmStore(s => s.conversations)
  const hasConvo   = !!convos[userId]
  const dmDisabled = social.isDmDisabled(userId)
  const dmStatus   = social.getDmStatus(userId)

  if (!dmDisabled || hasConvo) {
    return (
      <Button variant="primary" fullWidth={false} className="flex-1"
        onClick={() => { if (!me) return navigate('/signin'); navigate(`/chat/dms/${userId}`) }}>
        <MessageCircle size={13} /> Message
      </Button>
    )
  }

  // DMs disabled — show request flow
  if (!dmStatus) {
    return (
      <Button variant="outline" fullWidth={false} className="flex-1"
        onClick={() => {
          if (!me) return navigate('/signin')
          social.sendDmRequest(userId)
          toast.info(`DM request sent to ${profileUser.displayName}`)
        }}>
        <Send size={13} /> Request DM
      </Button>
    )
  }
  if (dmStatus === 'pending') {
    return (
      <div className="flex-1 flex items-center gap-2 justify-center bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
        <Clock size={13} className="text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
        <span className="text-xs font-bold text-amber-700">Request pending…</span>
      </div>
    )
  }
  if (dmStatus === 'accepted') {
    return (
      <Button variant="primary" fullWidth={false} className="flex-1"
        onClick={() => navigate(`/chat/dms/${userId}`)}>
        <MessageCircle size={13} /> Message
      </Button>
    )
  }
  if (dmStatus === 'declined') {
    return (
      <div className="flex-1 flex items-center gap-2 justify-center bg-red-50 border border-red-200 rounded-xl px-3 py-2">
        <XCircle size={13} className="text-red-500" />
        <span className="text-xs font-bold text-red-600">DM request declined</span>
      </div>
    )
  }
  return null
}

export default function UserProfilePage() {
  const { userId }    = useParams()
  const navigate      = useNavigate()
  const { user: me }  = useAuthStore()
  const social        = useSocialStore()
  const groups        = useGroupStore(s => s.groups)

  const [showMenu,    setMenu]    = useState(false)
  const [showBlock,   setBlock]   = useState(false)
  const [showReport,  setReport]  = useState(false)
  const [reportReason, setReason] = useState('')
  const [reportDone,  setRDone]   = useState(false)
  const [unblocking,  setUnblocking] = useState(false)

  const profileUser  = USERS[userId]
  const isOwn        = me?.id === userId
  const blocked      = social.isBlocked(userId)       // I blocked them
  const blockedByThem = social.isBlockedBy(userId)    // they blocked me
  const following    = social.isFollowing(userId)
  const muted        = social.isMuted(userId)
  const dmDisabled   = social.isDmDisabled(userId)

  const sharedGroups = Object.values(groups).filter(g =>
    g.members?.includes(me?.id) && g.members?.includes(userId)
  )

  // ── 404 ─────────────────────────────────────────────────────────────────────
  if (!profileUser) return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Profile" back />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="text-5xl block mb-2">🔍</span>
          <p className="font-extrabold text-gray-800 text-base mb-1">User not found</p>
          <p className="text-sm text-brand-mute leading-relaxed">This account may have been deleted or the username was mistyped.</p>
        </motion.div>
        <Button variant="outline" fullWidth={false} className="mt-3" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  )

  // ── They blocked you ─────────────────────────────────────────────────────────
  if (blockedByThem && !isOwn) return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Profile" back />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Avatar userId={userId} size={64} className="mx-auto mb-3" />
          <p className="font-extrabold text-gray-800 text-base mb-1">{profileUser.displayName}</p>
          <p className="text-xs text-brand-mute">@{profileUser.username}</p>
        </motion.div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 max-w-[260px] mt-2">
          <p className="text-sm font-semibold text-gray-600 leading-relaxed">
            This user has restricted who can view their profile and send messages.
          </p>
        </div>
        <Button variant="ghost" fullWidth={false} onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </div>
  )

  // ── You blocked them ─────────────────────────────────────────────────────────
  if (blocked && !isOwn) return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Profile" back />
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <span className="text-5xl block mb-2">🚫</span>
          <p className="font-extrabold text-gray-800 text-base mb-1">You blocked {profileUser.displayName}</p>
          <p className="text-sm text-brand-mute leading-relaxed">
            They can't see your profile or messages. Unblock to restore access.
          </p>
        </motion.div>
        <div className="bg-brand-surface border border-brand-border rounded-2xl p-3 text-xs text-brand-mute max-w-[240px]">
          <p>While blocked:</p>
          <p>• Their messages are hidden in all chats</p>
          <p>• They cannot DM you</p>
          <p>• They cannot see your profile</p>
        </div>
        <Button variant="danger" fullWidth={false}
          onClick={() => {
            setUnblocking(true)
            setTimeout(() => {
              social.unblockUser(userId)
              toast.success(`${profileUser.displayName} unblocked`)
              setUnblocking(false)
            }, 600)
          }}>
          {unblocking ? 'Unblocking…' : <><ShieldOff size={14} /> Unblock {profileUser.displayName}</>}
        </Button>
        <Button variant="ghost" fullWidth={false} onClick={() => navigate(-1)}>Cancel</Button>
      </div>
    </div>
  )

  // ── Normal / Own profile ─────────────────────────────────────────────────────
  const handleFollow = () => {
    if (!me) return navigate('/signin')
    if (following) { social.unfollowUser(userId); toast.info(`Unfollowed ${profileUser.displayName}`) }
    else           { social.followUser(userId);   toast.success(`Now following ${profileUser.displayName}`) }
  }

  const handleBlock = () => {
    social.blockUser(userId)
    setBlock(false); setMenu(false)
    toast.warn(`${profileUser.displayName} has been blocked`)
    setTimeout(() => navigate(-1), 800)
  }

  const handleReport = () => {
    if (!reportReason) return toast.error('Please select a reason')
    social.reportUser(userId, reportReason)
    setRDone(true)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title={isOwn ? 'My Profile' : 'Profile'}
        back
        right={
          !isOwn && (
            <div className="relative">
              <button
                onClick={() => setMenu(m => !m)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 transition-colors"
              >
                <MoreVertical size={18} />
              </button>
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setMenu(false)} />
                  <div className="absolute right-0 top-9 bg-white border border-brand-border rounded-xl shadow-card overflow-hidden z-20 min-w-[160px]">
                    <button
                      onClick={() => { setReport(true); setMenu(false) }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-brand-surface transition-colors"
                    >
                      <Flag size={13} className="text-brand-mute" /> Report user
                    </button>
                    <div className="h-px bg-brand-border mx-2" />
                    <button
                      onClick={() => { setBlock(true); setMenu(false) }}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Shield size={13} /> Block user
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        }
      />

      <div className="flex-1 overflow-y-auto thin-scroll">

        {/* Hero */}
        <div className="px-5 pt-5 pb-4 border-b border-brand-border"
          style={{ background: 'linear-gradient(180deg,#06558D0A 0%,transparent 100%)' }}>
          <div className="flex items-start gap-4 mb-3">
            <Avatar userId={userId} size={64} />
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <h1 className="text-lg font-black text-gray-900">{profileUser.displayName}</h1>
                {profileUser.online && <Tag variant="green">● Online</Tag>}
                {isOwn && <Tag variant="blue">You</Tag>}
              </div>
              <p className="text-xs text-brand-mute font-bold">@{profileUser.username}</p>
              {following && !isOwn && (
                <p className="text-[10px] text-brand-orange font-bold mt-1 flex items-center gap-1">
                  <CheckCircle size={10} /> Following
                </p>
              )}
              {dmDisabled && !isOwn && (
                <p className="text-[10px] text-amber-600 font-bold mt-1">⚠ DMs restricted</p>
              )}
            </div>
          </div>

          {profileUser.bio && (
            <p className="text-sm text-gray-700 leading-relaxed mb-3">{profileUser.bio}</p>
          )}

          {profileUser.interests?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {profileUser.interests.map(i => <Tag key={i}>{i}</Tag>)}
            </div>
          )}

          {profileUser.links?.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {profileUser.links.map(l => (
                <span key={l} className="flex items-center gap-1 text-xs font-bold text-brand-mid">
                  <Link2 size={10} /> {l}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-4 py-3 border-b border-brand-border">
          {isOwn ? (
            <Button variant="outline" onClick={() => navigate('/settings/profile')}>
              Edit Profile
            </Button>
          ) : !me ? (
            /* Guest: show sign-in nudge instead of action buttons */
            <div className="flex flex-col gap-2">
              <div className="bg-brand-surface border border-brand-border rounded-xl px-3 py-2.5 text-center">
                <p className="text-xs text-brand-mute font-semibold mb-2">
                  Sign in to message and follow {profileUser.displayName}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/signup')}
                    className="flex-1 bg-brand-orange text-white text-xs font-bold rounded-lg py-2 hover:bg-brand-orange-light transition-colors">
                    Sign Up
                  </button>
                  <button onClick={() => navigate('/signin')}
                    className="flex-1 border border-brand-orange text-brand-orange text-xs font-bold rounded-lg py-2 hover:bg-brand-orange-pale transition-colors">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <DmButton userId={userId} profileUser={profileUser} navigate={navigate} />
              <Button
                variant={following ? 'outline' : 'blue'}
                fullWidth={false} className="flex-1"
                onClick={handleFollow}
              >
                {following
                  ? <><UserCheck size={13} /> Following</>
                  : <><UserPlus size={13} /> Follow</>
                }
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-3 border-b border-brand-border">
          <div className="bg-brand-surface border border-brand-border rounded-xl overflow-hidden">
            <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider px-3 pt-3 pb-1">Info</p>
            {[
              ['Member since', profileUser.joinedAt],
              ['Status',       profileUser.online ? 'Online now' : 'Offline'],
              ['DMs',          dmDisabled ? 'Request required' : 'Open'],
            ].map(([label, val], i, arr) => (
              <div key={label} className={`flex justify-between text-xs px-3 py-2 ${i < arr.length - 1 ? 'border-b border-brand-border' : ''}`}>
                <span className="text-brand-mute font-semibold">{label}</span>
                <span className={`font-bold ${
                  label === 'Status' && profileUser.online ? 'text-green-600' :
                  label === 'DMs' && dmDisabled ? 'text-amber-600' : 'text-gray-700'
                }`}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shared groups */}
        {sharedGroups.length > 0 && !isOwn && (
          <div className="px-4 py-3 border-b border-brand-border">
            <p className="text-[10px] font-bold text-brand-mute uppercase tracking-wider mb-2">
              {sharedGroups.length} group{sharedGroups.length > 1 ? 's' : ''} in common
            </p>
            {sharedGroups.map(g => (
              <button key={g.id} onClick={() => navigate(`/groups/${g.id}`)}
                className="flex items-center gap-2.5 w-full py-2 border-b border-brand-border last:border-0 hover:bg-brand-surface transition-colors rounded px-1">
                <span className="text-xl leading-none">{g.emoji}</span>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold text-gray-800">{g.name}</p>
                  <p className="text-[10px] text-brand-mute">{g.memberCount} members</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bottom padding */}
        <div className="h-4" />
      </div>

      {/* Block modal */}
      <Modal open={showBlock} onClose={() => setBlock(false)} title="Block User">
        <div className="px-5 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Avatar userId={userId} size={44} />
            <div>
              <p className="font-bold text-gray-900">{profileUser.displayName}</p>
              <p className="text-xs text-brand-mute">@{profileUser.username}</p>
            </div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 space-y-1.5 text-xs text-red-700 font-semibold">
            <p>• Their messages will be hidden in all chats</p>
            <p>• They can't DM you or view your profile</p>
            <p>• They won't be notified that they were blocked</p>
            <p>• You can unblock anytime from their profile</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="danger" onClick={handleBlock}>
              <Shield size={14} /> Block {profileUser.displayName}
            </Button>
            <Button variant="ghost" onClick={() => setBlock(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      {/* Report modal */}
      <Modal
        open={showReport}
        onClose={() => { setReport(false); setRDone(false); setReason('') }}
        title="Report User"
      >
        <div className="px-5 py-4">
          {reportDone ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle size={40} className="text-green-500" />
              <p className="font-extrabold text-gray-900">Report submitted</p>
              <p className="text-sm text-brand-mute leading-relaxed">
                Thanks for keeping Skysurf safe. Our team will review this within 24 hours.
              </p>
              <Button onClick={() => { setReport(false); setRDone(false); setReason('') }}>Done</Button>
            </div>
          ) : (
            <>
              <p className="text-sm text-brand-mute mb-3 leading-relaxed">
                Why are you reporting <strong className="text-gray-900">{profileUser.displayName}</strong>?
              </p>
              <div className="flex flex-col gap-1.5 mb-4">
                {REPORT_REASONS.map(r => (
                  <button key={r} onClick={() => setReason(r)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                      ${reportReason === r
                        ? 'border-brand-orange bg-brand-orange-pale text-brand-orange'
                        : 'border-brand-border text-gray-700 hover:border-brand-mid'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <Button onClick={handleReport} disabled={!reportReason}>Submit Report</Button>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
