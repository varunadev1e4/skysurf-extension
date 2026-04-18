import { create } from 'zustand'
import { GROUPS } from '../data/dummy'
import { nanoid } from '../utils/nanoid'

const useGroupStore = create((set, get) => ({
  groups: { ...GROUPS },

  getGroup: (id) => get().groups[id],

  createGroup: ({ name, description, emoji, isPublic, currentUserId }) => {
    const id = 'g' + nanoid()
    const group = {
      id, name, description, emoji: emoji || '💬',
      memberCount: 1, isPublic,
      members: [currentUserId], admins: [currentUserId],
      createdAt: new Date().toISOString(), joined: true, messages: [],
    }
    set(s => ({ groups: { ...s.groups, [id]: group } }))
    return id
  },

  updateGroup: (groupId, updates) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g) return s
      return { groups: { ...s.groups, [groupId]: { ...g, ...updates } } }
    }),

  deleteGroup: (groupId) =>
    set(s => {
      const next = { ...s.groups }
      delete next[groupId]
      return { groups: next }
    }),

  joinGroup: (groupId, userId) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g || g.members.includes(userId)) return s
      return { groups: { ...s.groups, [groupId]: { ...g, members: [...g.members, userId], memberCount: g.memberCount + 1, joined: true } } }
    }),

  leaveGroup: (groupId, userId) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g) return s
      return { groups: { ...s.groups, [groupId]: { ...g, members: g.members.filter(m => m !== userId), memberCount: Math.max(0, g.memberCount - 1), joined: false } } }
    }),

  removeMember: (groupId, userId) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g) return s
      return { groups: { ...s.groups, [groupId]: { ...g, members: g.members.filter(m => m !== userId), admins: g.admins.filter(a => a !== userId), memberCount: Math.max(0, g.memberCount - 1) } } }
    }),

  addMember: (groupId, userId) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g || g.members.includes(userId)) return s
      return { groups: { ...s.groups, [groupId]: { ...g, members: [...g.members, userId], memberCount: g.memberCount + 1 } } }
    }),

  transferAdmin: (groupId, fromUserId, toUserId) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g || !g.members.includes(toUserId)) return s
      const nextAdmins = g.admins.filter(a => a !== fromUserId)
      if (!nextAdmins.includes(toUserId)) nextAdmins.push(toUserId)
      return { groups: { ...s.groups, [groupId]: { ...g, admins: nextAdmins } } }
    }),

  sendGroupMessage: (groupId, text, userId, replyTo = null) => {
    const msg = { id: nanoid(), userId, text, time: new Date().toISOString(), reacts: {}, replyTo, readBy: [userId] }
    set(s => {
      const g = s.groups[groupId]
      if (!g) return s
      return { groups: { ...s.groups, [groupId]: { ...g, messages: [...g.messages, msg] } } }
    })
  },

  markGroupMessageRead: (groupId, msgId, userId) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g) return s
      const messages = g.messages.map(m =>
        m.id === msgId && !m.readBy?.includes(userId)
          ? { ...m, readBy: [...(m.readBy || []), userId] }
          : m
      )
      return { groups: { ...s.groups, [groupId]: { ...g, messages } } }
    }),

  addGroupReact: (groupId, msgId, emoji, userId) =>
    set(s => {
      const g = s.groups[groupId]
      if (!g) return s
      const messages = g.messages.map(m => {
        if (m.id !== msgId) return m
        const curr = m.reacts[emoji] || []
        const updated = curr.includes(userId) ? curr.filter(u => u !== userId) : [...curr, userId]
        return { ...m, reacts: { ...m.reacts, [emoji]: updated } }
      })
      return { groups: { ...s.groups, [groupId]: { ...g, messages } } }
    }),
}))

export default useGroupStore
