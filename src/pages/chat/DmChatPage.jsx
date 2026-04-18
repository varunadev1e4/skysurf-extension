import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Shield } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import Avatar from '../../components/ui/Avatar'
import MessageBubble from '../../components/chat/MessageBubble'
import ChatInput from '../../components/chat/ChatInput'
import Button from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import useDmStore from '../../store/dmStore'
import useAuthStore from '../../store/authStore'
import useSocialStore from '../../store/socialStore'
import { USERS } from '../../data/dummy'

export default function DmChatPage() {
  const { userId }  = useParams()
  const navigate    = useNavigate()
  const bottomRef   = useRef(null)
  const { user }    = useAuthStore()
  const [replyTo, setReplyTo] = useState(null)
  const { getConversation, sendDM, markRead } = useDmStore()
  const { isBlocked, isBlockedBy, unblockUser } = useSocialStore()

  const convo   = getConversation(userId)
  const partner = USERS[userId] || {}
  const blocked = isBlocked(userId)
  const blockedByThem = isBlockedBy(userId)

  useEffect(() => {
    markRead(userId)
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [userId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [convo.messages.length])

  const handleSend = (text) => {
    if (!user) return navigate('/signin')
    if (blocked) return toast.error('Unblock this user to send messages')
    if (blockedByThem) return toast.error('You cannot message this user')
    sendDM(userId, text, user.id, replyTo)
    setReplyTo(null)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title={partner.displayName || 'DM'}
        back="/chat/dms"
        right={
          <button onClick={() => navigate(`/profile/${userId}`)}>
            <Avatar userId={userId} size={28} />
          </button>
        }
      />

      {/* Blocked banner */}
      {blocked && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border-b border-red-200 flex-shrink-0">
          <Shield size={13} className="text-red-500 flex-shrink-0" />
          <p className="text-xs font-semibold text-red-700 flex-1">You've blocked {partner.displayName}. Messages are paused.</p>
          <button onClick={() => { unblockUser(userId); toast.success(`${partner.displayName} unblocked`) }}
            className="text-xs font-bold text-red-600 border border-red-300 rounded-full px-2 py-0.5 hover:bg-red-100 transition-colors whitespace-nowrap">
            Unblock
          </button>
        </div>
      )}

      {blockedByThem && !blocked && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <Shield size={13} className="text-gray-400 flex-shrink-0" />
          <p className="text-xs font-semibold text-gray-500">You can't send messages to this user.</p>
        </div>
      )}

      {/* Profile strip */}
      <div className="flex flex-col items-center py-4 px-6 border-b border-brand-border bg-brand-surface flex-shrink-0">
        <button onClick={() => navigate(`/profile/${userId}`)} className="flex flex-col items-center gap-1 active:scale-95 transition-transform">
          <Avatar userId={userId} size={48} />
          <p className="font-extrabold text-gray-900 text-sm">{partner.displayName}</p>
          <p className="text-xs text-brand-mute">@{partner.username}</p>
        </button>
        {partner.bio && <p className="text-xs text-center text-gray-600 mt-1.5 max-w-xs leading-relaxed">{partner.bio}</p>}
        {partner.online && <span className="mt-1.5 text-[10px] font-bold text-green-600">● Active now</span>}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-3">
        {convo.messages.length === 0 && (
          <div className="text-center text-brand-mute text-xs py-8">
            <p className="text-2xl mb-2">👋</p>
            <p className="font-semibold">Start a conversation with {partner.displayName}</p>
          </div>
        )}
        {convo.messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} currentUserId={user?.id} onReply={(m) => setReplyTo(m)} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input — disabled if either side has blocked */}
      {(blocked || blockedByThem)
        ? (
          <div className="px-4 py-3 border-t border-brand-border bg-brand-surface flex-shrink-0 text-center">
            <p className="text-xs text-brand-mute">
              {blocked ? 'Unblock to resume messaging.' : 'Messaging is unavailable.'}
            </p>
          </div>
        )
        : <ChatInput placeholder={`Message ${partner.displayName}…`} onSend={handleSend} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
      }
    </div>
  )
}
