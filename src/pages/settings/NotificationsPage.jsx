import { useState } from 'react'
import { Bell, MessageSquare, Users, AtSign } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import { Toggle } from '../../components/ui/Tag'

const SECTIONS = [
  {
    title: 'Global Chat',
    Icon: MessageSquare,
    rows: [
      { key: 'gc_mention', label: 'Mentions', sub: 'When someone @mentions you' },
      { key: 'gc_react',   label: 'Reactions', sub: 'When someone reacts to your message' },
    ],
  },
  {
    title: 'Direct Messages',
    Icon: MessageSquare,
    rows: [
      { key: 'dm_chat',  label: 'New Messages', sub: 'When you receive a DM' },
      { key: 'dm_react', label: 'Reactions',    sub: 'Reactions on your DMs' },
    ],
  },
  {
    title: 'Groups',
    Icon: Users,
    rows: [
      { key: 'grp_chat',    label: 'New Messages', sub: 'Activity in your groups' },
      { key: 'grp_react',   label: 'Reactions',    sub: 'Reactions in group chats' },
      { key: 'grp_mention', label: 'Mentions',     sub: 'When you\'re mentioned in a group' },
    ],
  },
]

export default function NotificationsPage() {
  const [toggles, setToggles] = useState({
    gc_mention: true, gc_react: false,
    dm_chat: true,    dm_react: true,
    grp_chat: true,   grp_react: false, grp_mention: true,
  })

  const toggle = (key) => setToggles(t => ({ ...t, [key]: !t[key] }))

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar title="Notifications" back="/settings" />

      <div className="flex-1 overflow-y-auto thin-scroll px-5 py-5">
        {SECTIONS.map(({ title, Icon, rows }) => (
          <div key={title} className="mb-5">
            <p className="text-xs font-bold text-brand-mute uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Icon size={12} /> {title}
            </p>
            <div className="bg-brand-surface border border-brand-border rounded-2xl px-4">
              {rows.map(({ key, label, sub }, i) => (
                <div key={key} className={`flex items-center justify-between py-3.5 ${i < rows.length - 1 ? 'border-b border-brand-border' : ''}`}>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{label}</p>
                    <p className="text-xs text-brand-mute">{sub}</p>
                  </div>
                  <Toggle on={toggles[key]} onChange={() => toggle(key)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
