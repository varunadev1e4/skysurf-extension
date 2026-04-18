import { create } from 'zustand'
import { DM_CONVERSATIONS } from '../data/dummy'
import { nanoid } from '../utils/nanoid'

const useDmStore = create((set, get) => ({
  conversations: { ...DM_CONVERSATIONS },

  getConversation: (userId) =>
    get().conversations[userId] || { userId, messages: [], unread: 0 },

  sendDM: (toUserId, text, fromUserId, replyTo = null) => {
    const msg = {
      id: nanoid(), from: fromUserId, text,
      time: new Date().toISOString(), replyTo,
      readBy: [fromUserId],           // sender has read it
    }
    set(s => {
      const prev = s.conversations[toUserId] || { userId: toUserId, messages: [], unread: 0 }
      return { conversations: { ...s.conversations, [toUserId]: { ...prev, messages: [...prev.messages, msg], unread: 0 } } }
    })
  },

  markRead: (userId) =>
    set(s => {
      const prev = s.conversations[userId]
      if (!prev) return s
      const messages = prev.messages.map(m =>
        m.readBy?.includes(userId) ? m : { ...m, readBy: [...(m.readBy || []), userId] }
      )
      return { conversations: { ...s.conversations, [userId]: { ...prev, unread: 0, messages } } }
    }),

  totalUnread: () =>
    Object.values(get().conversations).reduce((n, c) => n + (c.unread || 0), 0),
}))

export default useDmStore
