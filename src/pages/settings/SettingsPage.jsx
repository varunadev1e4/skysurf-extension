import { useNavigate } from 'react-router-dom'
import { User, Shield, Bell, Clock, LogOut, ChevronRight, AlertTriangle } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import BottomNav from '../../components/layout/BottomNav'
import Avatar from '../../components/ui/Avatar'
import { toast } from '../../components/ui/Toast'
import useAuthStore from '../../store/authStore'
import GuestGate from '../../components/layout/GuestGate'

const MENU = [
  { icon: User,          label: 'Profile Settings',   sub: 'Name, bio, links, avatar',  path: '/settings/profile'  },
  { icon: Shield,        label: 'Privacy & Security', sub: 'Password, visibility, DMs', path: '/settings/privacy'  },
  { icon: Bell,          label: 'Notifications',      sub: 'Manage alerts & sounds',    path: '/settings/notifications' },
  { icon: Clock,         label: 'History',            sub: 'Your browsing chat history', path: '/settings/history' },
  { icon: AlertTriangle, label: 'Account Settings',   sub: 'Deactivate or delete',      path: '/settings/account', danger: true },
]

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuthStore()

  if (!user) return <GuestGate feature="settings" />

  const handleSignOut = () => {
    signOut()
    toast.info('Signed out successfully')
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Settings" />
      <div className="flex-1 overflow-y-auto thin-scroll">
        {/* Profile card */}
        {user && (
          <button onClick={() => navigate('/settings/profile')}
            className="w-full flex items-center gap-4 px-5 py-4 border-b border-brand-border hover:bg-brand-surface transition-colors">
            <Avatar userId={user.id} size={52} />
            <div className="flex-1 text-left">
              <p className="font-extrabold text-gray-900">{user.displayName}</p>
              <p className="text-xs text-brand-mute">@{user.username}</p>
              {user.bio && <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[220px]">{user.bio}</p>}
            </div>
            <ChevronRight size={16} className="text-brand-mute" />
          </button>
        )}

        <div className="px-4 py-3">
          {MENU.map(({ icon: Icon, label, sub, path, danger }) => (
            <button key={path} onClick={() => navigate(path)}
              className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-brand-surface transition-colors text-left mb-1">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-brand-light'}`}>
                <Icon size={17} className={danger ? 'text-red-500' : 'text-brand-deep'} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${danger ? 'text-red-600' : 'text-gray-900'}`}>{label}</p>
                <p className="text-xs text-brand-mute">{sub}</p>
              </div>
              <ChevronRight size={14} className="text-brand-mute" />
            </button>
          ))}
        </div>

        <div className="px-4 pb-5 mt-2">
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-red-50 transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <LogOut size={17} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-600">Sign Out</p>
              <p className="text-xs text-red-400">You can sign back in at any time</p>
            </div>
          </button>
        </div>

        <p className="text-center text-[10px] text-brand-mute pb-6">Skysurf v1.0.0 · Side Panel Edition</p>
      </div>
      <BottomNav />
    </div>
  )
}
