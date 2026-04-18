import { useLocation, useNavigate } from 'react-router-dom'
import { MessageSquare, Users, Bookmark, Settings, Lock } from 'lucide-react'
import useDmStore from '../../store/dmStore'
import useAuthStore from '../../store/authStore'

const TABS = [
  { path: '/chat',        guestPath: '/chat',        label: 'Chat',        Icon: MessageSquare, guestOk: true  },
  { path: '/groups',      guestPath: '/guest/groups', label: 'Groups',     Icon: Users,         guestOk: false },
  { path: '/collections', guestPath: '/guest/collections', label: 'Saved', Icon: Bookmark,      guestOk: false },
  { path: '/settings',    guestPath: '/guest/settings', label: 'Settings', Icon: Settings,      guestOk: false },
]

export default function BottomNav() {
  const location        = useLocation()
  const navigate        = useNavigate()
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const convos          = useDmStore(s => s.conversations)
  const totalUnread     = Object.values(convos).reduce((n, c) => n + (c.unread || 0), 0)

  return (
    <nav className="flex border-t border-brand-border bg-white flex-shrink-0">
      {TABS.map(({ path, guestPath, label, Icon, guestOk }) => {
        const locked    = !isAuthenticated && !guestOk
        const active    = location.pathname === path || location.pathname.startsWith(path + '/')
        const gateActive = location.pathname === guestPath
        const isActive   = active || gateActive
        const showBadge  = path === '/chat' && totalUnread > 0 && isAuthenticated

        const handleClick = () => {
          if (locked) navigate(guestPath)
          else        navigate(path)
        }

        return (
          <button
            key={path}
            onClick={handleClick}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative
              ${isActive && !locked ? 'text-brand-orange'
                : locked           ? 'text-gray-300 hover:text-gray-400'
                :                    'text-brand-mute hover:text-brand-mid'
              }`}
          >
            <div className="relative">
              {locked
                ? <Lock size={18} strokeWidth={2} />
                : <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              }
              {showBadge && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-orange text-white text-[9px] font-bold flex items-center justify-center">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold tracking-wide">{label}</span>
            {isActive && !locked && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-brand-orange" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
