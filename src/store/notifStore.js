import { create } from 'zustand'
import { nanoid } from '../utils/nanoid'

const t = (mins) => new Date(Date.now() - mins * 60000).toISOString()

const SEED_NOTIFICATIONS = [
  {
    id: 'n1', type: 'dm',       read: false,
    title: 'Yuki sent you a message',
    body: 'Sure! I can share the file. Give me a bit 😊',
    avatar: 'u2', time: t(5),  action: { navigate: '/chat/dms/u2' },
  },
  {
    id: 'n2', type: 'reaction', read: false,
    title: 'Arjun reacted to your message',
    body: '👍 on "Yeah feels different. Nav moved left."',
    avatar: 'u3', time: t(18), action: { navigate: '/chat' },
  },
  {
    id: 'n3', type: 'group',    read: false,
    title: 'New message in React Builders',
    body: 'Priya: The Actions API is the real standout for me. Async transitions ❤️',
    avatar: 'u4', time: t(32), action: { navigate: '/groups/g1' },
  },
  {
    id: 'n4', type: 'mention',  read: false,
    title: 'CodeNerd mentioned you',
    body: '@varun_dev You should really try Rust for your next CLI tool',
    avatar: 'u8', time: t(95), action: { navigate: '/chat' },
  },
  {
    id: 'n5', type: 'dm',       read: true,
    title: 'Priya sent you a message',
    body: 'Saw your comment on the Anthropic docs thread — are you building something with Claude?',
    avatar: 'u4', time: t(130), action: { navigate: '/chat/dms/u4' },
  },
  {
    id: 'n6', type: 'group',    read: true,
    title: 'Rahul joined Indie Hackers IN',
    body: 'Rahul is now a member of Indie Hackers IN',
    avatar: 'u6', time: t(280), action: { navigate: '/groups/g3' },
  },
  {
    id: 'n7', type: 'reaction', read: true,
    title: 'Meera reacted to your message',
    body: '🔥 on "47 signups in first 6 hours organically."',
    avatar: 'u5', time: t(310), action: { navigate: '/groups/g3' },
  },
]

const useNotifStore = create((set, get) => ({
  notifications: SEED_NOTIFICATIONS,

  unreadCount: () => get().notifications.filter(n => !n.read).length,

  markRead: (id) =>
    set(s => ({
      notifications: s.notifications.map(n => n.id === id ? { ...n, read: true } : n),
    })),

  markAllRead: () =>
    set(s => ({
      notifications: s.notifications.map(n => ({ ...n, read: true })),
    })),

  deleteNotif: (id) =>
    set(s => ({
      notifications: s.notifications.filter(n => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),

  push: ({ type, title, body, avatar, action }) =>
    set(s => ({
      notifications: [
        { id: nanoid(), type, title, body, avatar, action, read: false, time: new Date().toISOString() },
        ...s.notifications,
      ],
    })),
}))

export default useNotifStore
