import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Bell, Bookmark, User } from 'lucide-react'
import useNotifStore from '../../store/notifStore'
import useAuthStore from '../../store/authStore'

export default function TopBar({ title, back, right, showHomeIcons = false }) {
  const navigate        = useNavigate()
  const location        = useLocation()
  const { user }        = useAuthStore()
  const unreadCount     = useNotifStore(s => s.unreadCount())

  const handleBack = () => {
    if (!back) return
    if (typeof back === 'function') back()
    else if (typeof back === 'string') navigate(back)
    else navigate(-1)
  }

  // Show home icons when on the main chat screen with no back button
  const isMainChat = location.pathname === '/chat' || showHomeIcons

  return (
    <div
      className="flex items-center gap-1.5 px-3 h-11 flex-shrink-0"
      style={{ background: 'linear-gradient(180deg,#06558D 0%,#1B76B8 100%)', boxShadow: '0 2px 8px rgba(6,85,141,0.2)' }}
    >
      {/* Back button */}
      {back && (
        <button onClick={handleBack}
          className="p-1 -ml-1 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Title */}
      <span className="flex-1 text-xs font-extrabold tracking-wide uppercase text-white truncate">{title}</span>

      {/* Right slot OR home icons */}
      {right ? (
        <div className="flex items-center gap-1.5 flex-shrink-0">{right}</div>
      ) : isMainChat && !back ? (
        <div className="flex items-center gap-0.5 flex-shrink-0">
          {/* Notifications */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            title="Notifications"
          >
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-orange border border-white/80" />
            )}
          </button>

          {/* Collections */}
          <button
            onClick={() => navigate('/collections')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            title="Collections"
          >
            <Bookmark size={17} />
          </button>

          {/* Profile */}
          <button
            onClick={() => user ? navigate(`/profile/${user.id}`) : navigate('/signin')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            title="My Profile"
          >
            <User size={17} />
          </button>
        </div>
      ) : null}
    </div>
  )
}
