import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/layout/TopBar'
import BottomNav from '../../components/layout/BottomNav'
import GuestGate from '../../components/layout/GuestGate'
import Avatar from '../../components/ui/Avatar'
import { Badge } from '../../components/ui/Tag'
import useDmStore from '../../store/dmStore'
import useAuthStore from '../../store/authStore'
import { USERS } from '../../data/dummy'
import { timeAgo } from '../../utils/time'

export default function DmListPage() {
  const navigate        = useNavigate()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const conversations   = useDmStore(s => s.conversations)

  if (!isAuthenticated) return <GuestGate feature="dms" topBarTitle="Direct Messages" back="/chat" />

  const sorted = Object.values(conversations).sort((a, b) => {
    const aLast = a.messages[a.messages.length - 1]?.time || 0
    const bLast = b.messages[b.messages.length - 1]?.time || 0
    return new Date(bLast) - new Date(aLast)
  })

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Direct Messages" back="/chat" />
      <div className="flex-1 overflow-y-auto thin-scroll">
        {sorted.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-brand-mute gap-2 p-8">
            <span className="text-4xl">💬</span>
            <p className="font-bold">No conversations yet</p>
            <p className="text-sm text-center">Find someone in the global chat and start a DM.</p>
          </div>
        )}
        {sorted.map(convo => {
          const user    = USERS[convo.userId] || {}
          const lastMsg = convo.messages[convo.messages.length - 1]
          return (
            <button key={convo.userId} onClick={() => navigate(`/chat/dms/${convo.userId}`)}
              className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-brand-border hover:bg-brand-surface transition-colors text-left">
              <div className="relative">
                <Avatar userId={convo.userId} size={44} />
                {user.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <span className={`text-sm font-bold text-gray-900 ${convo.unread ? 'font-extrabold' : ''}`}>{user.displayName}</span>
                  {lastMsg && <span className="text-[10px] text-brand-mute">{timeAgo(lastMsg.time)}</span>}
                </div>
                <p className={`text-xs truncate ${convo.unread ? 'text-gray-700 font-semibold' : 'text-brand-mute'}`}>
                  {lastMsg?.text || 'No messages yet'}
                </p>
              </div>
              <Badge count={convo.unread} />
            </button>
          )
        })}
      </div>
      <BottomNav />
    </div>
  )
}
