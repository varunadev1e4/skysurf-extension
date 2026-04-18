import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Reply, Flag, MoreHorizontal } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { timeAgo } from '../../utils/time'
import { USERS } from '../../data/dummy'
import { toast } from '../ui/Toast'

const EMOJIS = ['👍','🔥','😂','🤯','👀','🎉','❤️','😮']

export default function MessageBubble({ msg, currentUserId, onReact, onReply }) {
  const navigate      = useNavigate()
  const moreRef       = useRef(null)
  const [showPicker, setPicker] = useState(false)
  const [showMenu,   setMenu]   = useState(false)
  const [menuPos,    setMenuPos] = useState({ top: 0, left: 0 })

  const senderId    = msg.userId || msg.from
  const isOwn       = senderId === currentUserId
  const user        = USERS[senderId] || {}

  const reactCounts = Object.entries(msg.reacts || {}).filter(([, u]) => u.length > 0)
  const myReacts    = Object.entries(msg.reacts || {})
    .filter(([, u]) => u.includes(currentUserId)).map(([e]) => e)
  const readByOthers = (msg.readBy || []).filter(id => id !== currentUserId)

  // Build reply quote from msg.replyTo
  const replyQuote = msg.replyTo
    ? {
        name: (USERS[msg.replyTo.userId || msg.replyTo.from] || {}).displayName || 'Unknown',
        text: msg.replyTo.text || '',
      }
    : null

  const handleReact = (emoji) => { onReact?.(msg.id, emoji); setPicker(false) }

  const openMenu = (e) => {
    e.stopPropagation()
    // Calculate position from button element so menu appears above/near it
    const rect = moreRef.current?.getBoundingClientRect()
    if (rect) {
      setMenuPos({
        top:  rect.bottom + 4,
        left: isOwn ? rect.right - 152 : rect.left,
      })
    }
    setMenu(m => !m)
  }

  const handleReply = () => { setMenu(false); onReply?.(msg) }
  const handleReport = () => { setMenu(false); toast.info('Message reported. Our team will review it.') }
  const goProfile = () => { if (!isOwn) navigate(`/profile/${senderId}`) }

  return (
    <>
      {/* Global click-away for menu */}
      {showMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setMenu(false)} />
      )}
      {/* Global click-away for emoji picker */}
      {showPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setPicker(false)} />
      )}

      {/* Fixed-position dropdown — renders above everything */}
      {showMenu && (
        <div
          className="fixed z-50 bg-white border border-brand-border rounded-xl shadow-modal overflow-hidden min-w-[152px]"
          style={{ top: menuPos.top, left: menuPos.left }}
          onClick={e => e.stopPropagation()}
        >
          {onReply && (
            <button onClick={handleReply}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-brand-surface transition-colors">
              <Reply size={13} className="text-brand-mute" /> Reply
            </button>
          )}
          <button onClick={() => { navigate(`/profile/${senderId}`); setMenu(false) }}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-brand-surface transition-colors">
            👤 View profile
          </button>
          <div className="h-px bg-brand-border mx-2" />
          <button onClick={handleReport}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors">
            <Flag size={13} /> Report message
          </button>
        </div>
      )}

      <div className={`flex gap-2 mb-3 group bubble-appear ${isOwn ? 'flex-row-reverse' : ''}`}>
        {/* Avatar */}
        {!isOwn && (
          <button onClick={goProfile}
            className="flex-shrink-0 self-end mb-5 rounded-full transition-transform active:scale-90">
            <Avatar userId={senderId} size={28} />
          </button>
        )}

        <div className={`flex flex-col gap-0.5 max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
          {/* Name */}
          {!isOwn && (
            <button onClick={goProfile}
              className="text-[11px] font-bold text-brand-deep px-1 hover:text-brand-orange transition-colors">
              {user.displayName || 'Unknown'}
            </button>
          )}

          {/* ── Reply quote ── */}
          {replyQuote && (
            <div className={`flex items-stretch gap-0 rounded-lg overflow-hidden mb-0.5 max-w-full
              ${isOwn ? 'bg-white/15 border border-white/20' : 'bg-brand-surface border border-brand-border'}`}>
              <div className={`w-0.5 flex-shrink-0 ${isOwn ? 'bg-white/50' : 'bg-brand-mid'}`} />
              <div className="px-2 py-1.5 min-w-0">
                <p className={`text-[10px] font-extrabold leading-none mb-0.5 ${isOwn ? 'text-white/80' : 'text-brand-mid'}`}>
                  {replyQuote.name}
                </p>
                <p className={`text-[11px] truncate max-w-[180px] leading-snug ${isOwn ? 'text-white/60' : 'text-brand-mute'}`}>
                  {replyQuote.text}
                </p>
              </div>
            </div>
          )}

          {/* ── Bubble + emoji picker ── */}
          <div className="relative">
            <button
              className={`relative rounded-2xl px-3 py-2 text-sm leading-relaxed text-left transition-transform active:scale-[0.98]
                ${isOwn
                  ? 'bg-brand-orange text-white rounded-br-sm'
                  : 'bg-brand-surface border border-brand-border text-gray-800 rounded-bl-sm'
                }`}
              onDoubleClick={() => setPicker(p => !p)}
              title="Double-click to react"
            >
              {msg.text}
            </button>

            {/* Emoji picker — fixed position */}
            {showPicker && (
              <div className={`fixed z-50 flex gap-1.5 bg-white border border-brand-border rounded-full px-2.5 py-1.5 shadow-modal`}
                style={(() => {
                  // Position above the bubble — we'll use a simple approach with CSS
                  return {}
                })()}
              >
                {/* Fallback: render inline above bubble */}
              </div>
            )}
          </div>

          {/* Emoji picker — inline above bubble (simpler, reliable) */}
          {showPicker && (
            <div className={`flex gap-1.5 bg-white border border-brand-border rounded-full px-2.5 py-1.5 shadow-card z-50 relative ${isOwn ? 'self-end' : 'self-start'}`}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => handleReact(e)}
                  className={`text-base hover:scale-125 transition-transform leading-none ${myReacts.includes(e) ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}>
                  {e}
                </button>
              ))}
            </div>
          )}

          {/* Reaction pills */}
          {reactCounts.length > 0 && (
            <div className="flex flex-wrap gap-1 px-1">
              {reactCounts.map(([emoji, users]) => (
                <button key={emoji} onClick={() => handleReact(emoji)}
                  className={`flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold border transition-colors
                    ${users.includes(currentUserId)
                      ? 'bg-brand-orange-pale border-brand-orange text-brand-orange'
                      : 'bg-white border-brand-border text-brand-mute hover:bg-brand-light'
                    }`}>
                  {emoji} <span>{users.length}</span>
                </button>
              ))}
            </div>
          )}

          {/* Time + read receipts + actions */}
          <div className={`flex items-center gap-2 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
            <span className="text-[10px] text-brand-mute">{timeAgo(msg.time)}</span>
            {isOwn && readByOthers.length > 0 && (
              <span className="text-[10px] text-brand-mid font-bold">
                ✓✓ {readByOthers.length > 1 ? `${readByOthers.length} read` : 'Read'}
              </span>
            )}

            {/* Hover actions */}
            {!isOwn && (
              <div className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                {onReply && (
                  <button onClick={handleReply} title="Reply"
                    className="w-5 h-5 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center hover:bg-brand-light transition-colors">
                    <Reply size={10} className="text-brand-mute" />
                  </button>
                )}
                <button
                  ref={moreRef}
                  onClick={openMenu}
                  title="More options"
                  className="w-5 h-5 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center hover:bg-brand-light transition-colors"
                >
                  <MoreHorizontal size={10} className="text-brand-mute" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
