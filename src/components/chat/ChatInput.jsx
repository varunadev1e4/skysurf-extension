import { useState, useRef, useEffect } from 'react'
import { Send, X, Reply } from 'lucide-react'
import { USERS } from '../../data/dummy'

export default function ChatInput({ placeholder = 'Message…', onSend, disabled = false, replyTo, onCancelReply }) {
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (replyTo) inputRef.current?.focus()
  }, [replyTo])

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit() }
  }

  const replyUser    = replyTo ? (USERS[replyTo.userId || replyTo.from] || {}) : null
  const replyText    = replyTo?.text || ''
  const replyName    = replyUser?.displayName || 'Unknown'

  return (
    <div className="border-t border-brand-border bg-white flex-shrink-0">
      {/* ── Reply preview strip ── */}
      {replyTo && (
        <div className="flex items-stretch gap-0 mx-3 mt-2 mb-1 rounded-xl overflow-hidden border border-brand-mid/30 bg-brand-surface">
          {/* Accent bar */}
          <div className="w-1 bg-brand-mid flex-shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0 px-2.5 py-2">
            <Reply size={13} className="text-brand-mid flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-extrabold text-brand-mid leading-none mb-0.5">
                Replying to {replyName}
              </p>
              <p className="text-[11px] text-brand-mute truncate leading-snug">{replyText}</p>
            </div>
          </div>
          <button
            onClick={onCancelReply}
            className="px-2.5 flex items-center text-brand-mute hover:text-gray-700 hover:bg-brand-border/50 transition-colors flex-shrink-0"
            title="Cancel reply"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Input row ── */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <input
          ref={inputRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-brand-surface border border-brand-border rounded-full px-4 py-2 text-sm font-medium text-gray-800 outline-none focus:border-brand-mid focus:ring-2 focus:ring-brand-light transition-all placeholder:text-brand-mute disabled:opacity-50"
        />
        <button
          onClick={submit}
          disabled={!text.trim() || disabled}
          className="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-brand-orange-light active:scale-95 transition-all"
        >
          <Send size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
