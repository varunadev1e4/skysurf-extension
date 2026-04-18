import { useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, Sparkles, MessageCircle, Users, Star, BookmarkPlus, ToggleLeft, ToggleRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useChatStore from '../../store/chatStore'
import useAuthStore from '../../store/authStore'
import useSocialStore from '../../store/socialStore'
import useCollectionStore from '../../store/collectionStore'
import { useTabUrl } from '../../hooks/useTabUrl'
import TopBar from '../../components/layout/TopBar'
import BottomNav from '../../components/layout/BottomNav'
import MessageBubble from '../../components/chat/MessageBubble'
import ChatInput from '../../components/chat/ChatInput'
import Modal from '../../components/ui/Modal'
import { Tag } from '../../components/ui/Tag'
import { toast } from '../../components/ui/Toast'
import GuestChatBanner from '../../components/ui/GuestChatBanner'


export default function GlobalChatPage() {
  const navigate  = useNavigate()
  const bottomRef = useRef(null)
  const [urlOpen,    setUrlOpen]    = useState(false)
  const [addColOpen, setAddCol]     = useState(false)
  const [replyTo,    setReplyTo]    = useState(null)

  useTabUrl()

  const { activeUrl, setActiveUrl, sendMessage, addReact, messages, urls } = useChatStore()
  const { user, isAuthenticated } = useAuthStore()
  const { blocked, isFavorite, toggleFavorite, acceptDMs, setAcceptDMs } = useSocialStore()
  const collections = useCollectionStore(s => s.collections)
  const { addUrl: addUrlToCol } = useCollectionStore()

  const urlInfo  = urls.find(u => u.id === activeUrl) || urls[0]
  const allMsgs  = messages[activeUrl] || []
  const chatMsgs = allMsgs.filter(m => !blocked.includes(m.userId || m.from))
  const fav      = isFavorite(activeUrl)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMsgs.length])

  const handleSend = (text) => {
    if (!isAuthenticated) { toast.warn('Sign in to send messages'); return navigate('/signin') }
    sendMessage(text, user.id, replyTo)
    setReplyTo(null)
  }

  const handleReact = (msgId, emoji) => {
    if (!isAuthenticated) return navigate('/signin')
    addReact(msgId, emoji, user.id)
  }

  const handleAddToCollection = (colId) => {
    const clean = activeUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const result = addUrlToCol(colId, clean)
    if (result?.error) toast.error(result.error)
    else toast.success('Added to collection!')
    setAddCol(false)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title="skysurf · global chat"
        right={
          !isAuthenticated
            ? (
              <div className="flex gap-1.5">
                <button onClick={() => navigate('/signin')} className="text-white/90 text-[11px] font-bold border border-white/40 rounded-lg px-2.5 py-1 hover:bg-white/10 transition-colors">Sign In</button>
                <button onClick={() => navigate('/signup')} className="bg-brand-orange text-white text-[11px] font-bold rounded-lg px-2.5 py-1 hover:bg-brand-orange-light transition-colors">Sign Up</button>
              </div>
            ) : null
        }
      />

      {/* URL bar */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setUrlOpen(o => !o)}
          className="w-full flex items-center gap-2 px-3 py-2 bg-brand-surface border-b border-brand-border hover:bg-brand-light transition-colors"
        >
          <span className="text-brand-mid text-xs">⌾</span>
          <span className="flex-1 text-left text-xs font-semibold text-gray-700 truncate">{urlInfo?.label}</span>
          {fav && <Star size={11} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />}
          <Tag>{urlInfo?.online ?? 0} online</Tag>
          <ChevronDown size={12} className={`text-brand-mute transition-transform ${urlOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {urlOpen && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12 }}
              className="absolute z-20 left-0 right-0 bg-white border border-brand-border shadow-card rounded-b-xl overflow-hidden max-h-52 overflow-y-auto thin-scroll">
              {urls.map(url => (
                <button key={url.id} onClick={() => { setActiveUrl(url.id); setUrlOpen(false) }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-brand-surface transition-colors ${url.id === activeUrl ? 'bg-brand-light font-bold text-brand-deep' : 'text-gray-700'}`}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: url.id === activeUrl ? '#FF3D00' : '#D6EAF2' }} />
                  <span className="flex-1 text-left truncate">{url.label}</span>
                  {isFavorite(url.id) && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
                  <span className="text-[10px] text-brand-mute font-bold">{url.online} online</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick actions */}
      <div className="flex gap-1.5 px-3 py-1.5 border-b border-brand-border flex-shrink-0 overflow-x-auto scroll-hide">
        <button onClick={() => navigate('/chat/ai-summary')} className="flex items-center gap-1 text-[10px] font-bold text-brand-deep bg-brand-light border border-brand-border rounded-full px-2.5 py-1 hover:bg-brand-light/80 transition-colors whitespace-nowrap flex-shrink-0">
          <Sparkles size={10} /> AI Summary
        </button>
        <button onClick={() => isAuthenticated ? navigate('/chat/dms') : navigate('/signin')} className="flex items-center gap-1 text-[10px] font-bold text-brand-mute bg-brand-surface border border-brand-border rounded-full px-2.5 py-1 hover:bg-brand-light transition-colors whitespace-nowrap flex-shrink-0">
          <MessageCircle size={10} /> DMs
        </button>
        <button onClick={() => navigate('/groups')} className="flex items-center gap-1 text-[10px] font-bold text-brand-mute bg-brand-surface border border-brand-border rounded-full px-2.5 py-1 hover:bg-brand-light transition-colors whitespace-nowrap flex-shrink-0">
          <Users size={10} /> Groups
        </button>
        {isAuthenticated && (
          <button
            onClick={() => { toggleFavorite(activeUrl); toast.success(fav ? 'Removed from favourites' : 'Added to favourites!') }}
            className={`flex items-center gap-1 text-[10px] font-bold border rounded-full px-2.5 py-1 transition-colors whitespace-nowrap flex-shrink-0 ${
              fav ? 'text-yellow-700 bg-yellow-50 border-yellow-200' : 'text-brand-mute bg-brand-surface border-brand-border'
            }`}>
            <Star size={10} className={fav ? 'fill-yellow-500 text-yellow-500' : ''} /> {fav ? 'Favourited' : 'Favourite'}
          </button>
        )}
        {isAuthenticated && (
          <button onClick={() => setAddCol(true)} className="flex items-center gap-1 text-[10px] font-bold text-brand-mute bg-brand-surface border border-brand-border rounded-full px-2.5 py-1 hover:bg-brand-light transition-colors whitespace-nowrap flex-shrink-0">
            <BookmarkPlus size={10} /> Add to Collection
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={() => { setAcceptDMs(!acceptDMs); toast.info(acceptDMs ? 'DMs paused' : 'DMs enabled') }}
            className={`flex items-center gap-1 text-[10px] font-bold border rounded-full px-2.5 py-1 transition-colors whitespace-nowrap flex-shrink-0 ${acceptDMs ? 'text-green-700 bg-green-50 border-green-200' : 'text-brand-mute bg-brand-surface border-brand-border'}`}>
            {acceptDMs ? <ToggleRight size={10} /> : <ToggleLeft size={10} />} Accept DMs
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto thin-scroll px-3 py-3">
        {chatMsgs.length === 0 && isAuthenticated && (
          <div className="flex flex-col items-center justify-center py-10 text-brand-mute gap-1">
            <p className="text-2xl">💬</p>
            <p className="text-xs font-semibold">Be the first to say something!</p>
          </div>
        )}
        {chatMsgs.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            currentUserId={user?.id}
            onReact={handleReact}
            onReply={isAuthenticated ? (m) => setReplyTo(m) : null}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {isAuthenticated
        ? <ChatInput
            placeholder={`Message ${urlInfo?.label}…`}
            onSend={handleSend}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        : <GuestChatBanner navigate={navigate} />
      }

      <BottomNav />

      {/* Add to collection modal */}
      <Modal open={addColOpen} onClose={() => setAddCol(false)} title="Add to Collection">
        <div className="px-5 py-4">
          <p className="text-xs text-brand-mute mb-3 font-semibold">Select a collection to add <strong>{urlInfo?.label}</strong> to:</p>
          {Object.values(collections).length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-brand-mute">No collections yet.</p>
              <button onClick={() => { setAddCol(false); navigate('/collections') }} className="text-brand-orange font-bold text-sm mt-1">Create one →</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.values(collections).map(col => (
                <button key={col.id} onClick={() => handleAddToCollection(col.id)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl border border-brand-border hover:border-brand-orange hover:bg-brand-orange-pale transition-colors text-left">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{col.name}</p>
                    <p className="text-xs text-brand-mute">{col.urls.length}/10 URLs</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.urls.length >= 10 ? 'bg-red-100 text-red-600' : 'bg-brand-light text-brand-deep'}`}>
                    {col.urls.length >= 10 ? 'Full' : 'Add'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
