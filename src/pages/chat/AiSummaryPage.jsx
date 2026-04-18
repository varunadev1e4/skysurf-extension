import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, MessageSquare, User } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import Avatar from '../../components/ui/Avatar'
import { Tag } from '../../components/ui/Tag'
import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'
import { AI_SUMMARIES, USERS } from '../../data/dummy'

const MOOD_COLORS = {
  Curious:     'bg-blue-50 text-blue-700 border-blue-200',
  Educational: 'bg-green-50 text-green-700 border-green-200',
  Excited:     'bg-orange-50 text-brand-orange border-orange-200',
}

export default function AiSummaryPage() {
  const navigate   = useNavigate()
  const activeUrl  = useChatStore(s => s.activeUrl)
  const messages   = useChatStore(s => s.messages[s.activeUrl] || [])
  const summary    = AI_SUMMARIES[activeUrl]
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="AI Summary" back="/chat" />

      <div className="flex-1 overflow-y-auto thin-scroll px-5 py-5">
        {/* URL badge */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-sm font-bold text-brand-mute truncate">{activeUrl}</span>
          {summary && (
            <span className={`text-xs font-bold border rounded-full px-2.5 py-0.5 ${MOOD_COLORS[summary.mood] || 'bg-brand-surface text-brand-mute border-brand-border'}`}>
              {summary.mood}
            </span>
          )}
        </div>

        {/* AI Card */}
        <div className="bg-gradient-to-br from-brand-deep/5 to-brand-mid/10 border border-brand-border rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-brand-deep flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-extrabold text-sm text-brand-deep">Claude's Summary</span>
          </div>

          {summary ? (
            <ul className="flex flex-col gap-3">
              {summary.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                  {pt}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-brand-mute italic">No summary available for this URL yet. Chat more to generate one!</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex items-center gap-3">
            <MessageSquare size={18} className="text-brand-mid" />
            <div>
              <p className="text-lg font-black text-gray-900">{messages.length}</p>
              <p className="text-xs text-brand-mute font-semibold">Messages</p>
            </div>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-xl p-4 flex items-center gap-3">
            <User size={18} className="text-brand-mid" />
            <div>
              <p className="text-lg font-black text-gray-900">
                {new Set(messages.map(m => m.userId)).size}
              </p>
              <p className="text-xs text-brand-mute font-semibold">Participants</p>
            </div>
          </div>
        </div>

        {/* Most active user */}
        {summary?.topUser && (
          <div className="border border-brand-border rounded-xl p-4">
            <p className="text-xs font-bold text-brand-mute uppercase tracking-wider mb-3">Most Active</p>
            <button
              onClick={() => navigate(`/profile/${summary.topUser}`)}
              className="flex items-center gap-3 w-full"
            >
              <Avatar userId={summary.topUser} size={40} />
              <div className="text-left">
                <p className="font-bold text-sm text-gray-900">{USERS[summary.topUser]?.displayName}</p>
                <p className="text-xs text-brand-mute">@{USERS[summary.topUser]?.username}</p>
              </div>
              <TrendingUp size={16} className="text-brand-orange ml-auto" />
            </button>
          </div>
        )}
      </div>
      {!isAuthenticated && (
        <div className="flex-shrink-0 px-4 py-3 border-t border-brand-border bg-brand-surface">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-brand-mute font-semibold">Sign in to join the chat on this page</p>
            <button
              onClick={() => navigate('/signup')}
              className="bg-brand-orange text-white text-[11px] font-bold rounded-lg px-3 py-1.5 hover:bg-brand-orange-light transition-colors whitespace-nowrap"
            >
              Sign Up Free
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
