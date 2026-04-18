import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const SEEDED_BLOCKED_BY = ['u8']
const DM_DISABLED_USERS = ['u5']

const useSocialStore = create(
  persist(
    (set, get) => ({
      blocked:     [],
      blockedBy:   SEEDED_BLOCKED_BY,
      following:   [],
      muted:       [],          // muted userIds
      mutedConvos: [],          // muted DM convo userIds
      favorites:   [],          // favorited URL strings
      dmRequests:  {},
      acceptDMs:   true,        // global toggle: accept DM requests

      blockUser: (uid) =>
        set(s => ({ blocked: [...new Set([...s.blocked, uid])], blockedBy: s.blockedBy.filter(id => id !== uid) })),
      unblockUser: (uid) =>
        set(s => ({ blocked: s.blocked.filter(id => id !== uid) })),
      isBlocked:   (uid) => get().blocked.includes(uid),
      isBlockedBy: (uid) => get().blockedBy.includes(uid),

      muteUser: (uid) =>
        set(s => ({ muted: [...new Set([...s.muted, uid])] })),
      unmuteUser: (uid) =>
        set(s => ({ muted: s.muted.filter(id => id !== uid) })),
      isMuted: (uid) => get().muted.includes(uid),

      muteConvo: (uid) =>
        set(s => ({ mutedConvos: [...new Set([...s.mutedConvos, uid])] })),
      unmuteConvo: (uid) =>
        set(s => ({ mutedConvos: s.mutedConvos.filter(id => id !== uid) })),
      isConvoMuted: (uid) => get().mutedConvos.includes(uid),

      followUser: (uid) =>
        set(s => ({ following: [...new Set([...s.following, uid])] })),
      unfollowUser: (uid) =>
        set(s => ({ following: s.following.filter(id => id !== uid) })),
      isFollowing: (uid) => get().following.includes(uid),

      toggleFavorite: (url) =>
        set(s => ({
          favorites: s.favorites.includes(url)
            ? s.favorites.filter(u => u !== url)
            : [...s.favorites, url],
        })),
      isFavorite: (url) => get().favorites.includes(url),

      setAcceptDMs: (val) => set({ acceptDMs: val }),

      isDmDisabled: (uid) => DM_DISABLED_USERS.includes(uid),

      sendDmRequest: (uid) => {
        set(s => ({ dmRequests: { ...s.dmRequests, [uid]: 'pending' } }))
        setTimeout(() => {
          if (get().dmRequests[uid] === 'pending')
            set(s => ({ dmRequests: { ...s.dmRequests, [uid]: 'accepted' } }))
        }, 2500)
      },
      getDmStatus: (uid) => get().dmRequests[uid] || null,

      reportUser: (_uid, _reason) => {},
    }),
    {
      name: 'skysurf-social',
      partialize: (s) => ({
        blocked: s.blocked, following: s.following, muted: s.muted,
        mutedConvos: s.mutedConvos, favorites: s.favorites,
        dmRequests: s.dmRequests, acceptDMs: s.acceptDMs,
      }),
      onRehydrateStorage: () => (s) => { if (s) s.blockedBy = SEEDED_BLOCKED_BY },
    }
  )
)

export default useSocialStore
