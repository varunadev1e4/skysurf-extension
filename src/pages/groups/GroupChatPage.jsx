import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Info } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import MessageBubble from '../../components/chat/MessageBubble'
import ChatInput from '../../components/chat/ChatInput'
import { toast } from '../../components/ui/Toast'
import GuestGate from '../../components/layout/GuestGate'
import useGroupStore from '../../store/groupStore'
import useAuthStore from '../../store/authStore'
import useSocialStore from '../../store/socialStore'

export default function GroupChatPage() {
  const { groupId } = useParams()
  const navigate    = useNavigate()
  const bottomRef   = useRef(null)
  const { user }    = useAuthStore()
  const blocked     = useSocialStore(s => s.blocked)
  const { getGroup, sendGroupMessage, addGroupReact } = useGroupStore()
  const group = getGroup(groupId)
  const [replyTo, setReplyTo] = useState(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [group?.messages?.length])

  if (!group) return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Group" back="/groups" />
      <div className="flex-1 flex flex-col items-center justify-center gap-2 p-8 text-center text-brand-mute">
        <span className="text-4xl">💨</span>
        <p className="font-bold text-sm">Group not found</p>
        <p className="text-xs">It may have been deleted or you were removed.</p>
      </div>
    </div>
  )

  const handleSend = (text) => {
    if (!user) return navigate('/signin')
    sendGroupMessage(groupId, text, user.id, replyTo)
    setReplyTo(null)
  }

  const handleReact = (msgId, emoji) => {
    if (!user) return navigate('/signin')
    addGroupReact(groupId, msgId, emoji, user.id)
  }

  // Filter out blocked users' messages
  const visibleMessages = (group.messages || []).filter(
    m => !blocked.includes(m.userId)
  )

  const isMember = group.members?.includes(user?.id)

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title={`${group.emoji} ${group.name}`}
        back="/groups"
        right={
          <button onClick={() => navigate(`/groups/${groupId}/info`)}
            className="text-white/80 hover:text-white transition-colors">
            <Info size={18} />
          </button>
        }
      />

      <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-surface border-b border-brand-border flex-shrink-0">
        <span className="text-[10px] text-brand-mute font-semibold">{group.memberCount} members</span>
        <span className="w-1 h-1 rounded-full bg-brand-mute" />
        <span className="text-[10px] text-brand-mute font-semibold">{group.isPublic ? '🌍 Public' : '🔒 Private'}</span>
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-3">
        {visibleMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-brand-mute gap-1.5">
            <span className="text-3xl">{group.emoji}</span>
            <p className="font-bold text-sm">No messages yet</p>
            <p className="text-xs text-center max-w-[180px]">{group.description}</p>
          </div>
        )}
        {visibleMessages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            currentUserId={user?.id}
            onReact={handleReact}
            onReply={isMember ? (m) => setReplyTo(m) : null}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {isMember ? (
        <ChatInput placeholder={`Message ${group.name}…`} onSend={handleSend} replyTo={replyTo} onCancelReply={() => setReplyTo(null)} />
      ) : !user ? (
        <div className="border-t border-brand-border bg-white flex-shrink-0">
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="flex-1 bg-brand-surface border border-brand-border rounded-xl px-3 py-2">
              <p className="text-xs font-semibold text-brand-mute">Sign in to join and send messages</p>
            </div>
            <button onClick={() => navigate('/signup')} className="bg-brand-orange text-white text-xs font-bold rounded-xl px-3 py-2 hover:bg-brand-orange-light transition-colors whitespace-nowrap">
              Join Free
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 border-t border-brand-border bg-brand-surface flex-shrink-0 text-center">
          <p className="text-xs text-brand-mute mb-1">You're not a member of this group.</p>
          <button onClick={() => navigate(`/groups/${groupId}/info`)} className="text-xs font-bold text-brand-orange">
            Join this group →
          </button>
        </div>
      )}
    </div>
  )
}
