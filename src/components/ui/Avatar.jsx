import { USERS, AVATAR_COLORS } from '../../data/dummy'

export default function Avatar({ userId, size = 36, className = '' }) {
  const user = USERS[userId] || {}
  const initials = user.initials || (user.displayName || '?')[0].toUpperCase()
  const colors = AVATAR_COLORS[userId] || ['#06558D', '#1B76B8']

  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
        background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        border: '2px solid rgba(255,255,255,0.9)',
        boxShadow: '0 1px 4px rgba(6,85,141,0.18)',
      }}
    >
      {initials}
    </div>
  )
}
