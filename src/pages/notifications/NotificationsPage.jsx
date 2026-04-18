import { useNavigate } from 'react-router-dom'
import { Bell, BellOff, Check, Trash2, MessageCircle, Users, AtSign, Heart, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from '../../components/layout/TopBar'
import Avatar from '../../components/ui/Avatar'
import { toast } from '../../components/ui/Toast'
import useNotifStore from '../../store/notifStore'
import { timeAgo } from '../../utils/time'

const TYPE_META = {
  dm:       { Icon: MessageCircle, color: 'text-brand-orange',  bg: 'bg-brand-orange-pale' },
  group:    { Icon: Users,          color: 'text-brand-deep',    bg: 'bg-brand-light'        },
  reaction: { Icon: Heart,          color: 'text-pink-500',      bg: 'bg-pink-50'            },
  mention:  { Icon: AtSign,         color: 'text-purple-600',    bg: 'bg-purple-50'          },
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, markRead, markAllRead, deleteNotif, clearAll, unreadCount } = useNotifStore()
  const unread = unreadCount()

  const handleClick = (notif) => {
    markRead(notif.id)
    if (notif.action?.navigate) navigate(notif.action.navigate)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title="Notifications"
        back="/chat"
        right={
          unread > 0 && (
            <button
              onClick={() => { markAllRead(); toast.success('All marked as read') }}
              className="flex items-center gap-1 text-white/80 hover:text-white text-[10px] font-bold transition-colors"
            >
              <Check size={13} /> All read
            </button>
          )
        }
      />

      {/* Unread count strip */}
      {unread > 0 && (
        <div className="px-4 py-2 bg-brand-surface border-b border-brand-border flex items-center justify-between flex-shrink-0">
          <span className="text-[11px] font-bold text-brand-deep">{unread} unread notification{unread !== 1 ? 's' : ''}</span>
          {notifications.length > 0 && (
            <button onClick={() => { clearAll(); toast.info('Notifications cleared') }}
              className="text-[10px] font-bold text-brand-mute hover:text-red-500 transition-colors flex items-center gap-1">
              <Trash2 size={11} /> Clear all
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-y-auto thin-scroll">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center">
              <BellOff size={24} className="text-brand-mute" />
            </div>
            <p className="font-extrabold text-gray-800">No notifications yet</p>
            <p className="text-sm text-brand-mute leading-relaxed">
              Mentions, reactions, and DMs will show up here.
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {notifications.map(notif => {
              const meta = TYPE_META[notif.type] || TYPE_META.group
              const { Icon } = meta
              return (
                <motion.div
                  key={notif.id}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.18 }}
                  className={`flex items-start gap-3 px-4 py-3.5 border-b border-brand-border cursor-pointer transition-colors group
                    ${notif.read ? 'bg-white hover:bg-brand-surface/50' : 'bg-brand-surface hover:bg-brand-light/40'}`}
                  onClick={() => handleClick(notif)}
                >
                  {/* Avatar + type icon */}
                  <div className="relative flex-shrink-0">
                    <Avatar userId={notif.avatar} size={38} />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center ${meta.bg} border-2 border-white`}>
                      <Icon size={10} className={meta.color} />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-snug mb-0.5 ${notif.read ? 'font-semibold text-gray-700' : 'font-extrabold text-gray-900'}`}>
                      {notif.title}
                    </p>
                    <p className="text-[11px] text-brand-mute leading-relaxed line-clamp-2">{notif.body}</p>
                    <p className="text-[10px] text-brand-mute mt-1 font-semibold">{timeAgo(notif.time)}</p>
                  </div>

                  {/* Unread dot + delete */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-orange flex-shrink-0" />
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); deleteNotif(notif.id) }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-mute hover:text-red-500"
                      title="Dismiss"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
