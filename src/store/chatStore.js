import { create } from 'zustand'
import { GLOBAL_MESSAGES, URLS } from '../data/dummy'
import { nanoid } from '../utils/nanoid'

const useChatStore = create((set, get) => ({
  messages:  { ...GLOBAL_MESSAGES },
  activeUrl: URLS[0].id,
  urls:      [...URLS],

  setActiveUrl: (url) => set({ activeUrl: url }),

  addDynamicUrl: ({ id, label, host, title, online = 1 }) => {
    set(s => {
      if (s.urls.find(u => u.id === id)) return s
      return {
        urls:     [{ id, label, host, title, online }, ...s.urls],
        messages: { ...s.messages, [id]: [] },
      }
    })
  },

  sendMessage: (text, userId, replyTo = null) => {
    const { activeUrl } = get()
    const msg = {
      id: nanoid(),
      userId,
      text,
      time: new Date().toISOString(),
      reacts: {},
      readBy: [userId],
      // Store the full replyTo message object so the bubble can render it
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, userId: replyTo.userId, from: replyTo.from } : null,
    }
    set(s => ({
      messages: {
        ...s.messages,
        [activeUrl]: [...(s.messages[activeUrl] || []), msg],
      },
    }))
  },

  addReact: (msgId, emoji, userId) => {
    const { activeUrl } = get()
    set(s => {
      const msgs = (s.messages[activeUrl] || []).map(m => {
        if (m.id !== msgId) return m
        const curr    = m.reacts[emoji] || []
        const updated = curr.includes(userId) ? curr.filter(u => u !== userId) : [...curr, userId]
        return { ...m, reacts: { ...m.reacts, [emoji]: updated } }
      })
      return { messages: { ...s.messages, [activeUrl]: msgs } }
    })
  },
}))

export default useChatStore
