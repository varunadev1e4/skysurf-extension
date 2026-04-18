# Skysurf — Chrome Side Panel Extension 🌐

> Chat with people browsing the **same page** as you. Find your people across the web.

A Chrome extension (Manifest V3) that opens as a **side panel** — giving you a full-height chat panel alongside any page you visit.

---

## ⚡ Load in Chrome RIGHT NOW (pre-built)

Use the **`skysurf-extension-dist.zip`** — already built, no Node.js needed.

```
1. Unzip → you get a  dist/  folder
2. Open Chrome → chrome://extensions
3. Enable Developer Mode  (top-right toggle)
4. Click "Load unpacked"
5. Select the dist/ folder
6. Click the Skysurf icon in your Chrome toolbar → side panel opens!
```

> **Tip:** Click the 🧩 puzzle piece in Chrome toolbar and pin Skysurf for quick access.

---

## 🛠 Develop & Build from Source

```bash
unzip skysurf-extension-src.zip
cd skysurf
npm install

# Dev mode — simulated side panel in browser
npm run dev          # → http://localhost:5173

# Build extension after making changes
npm run build        # → dist/ (auto-fixes asset paths)

# Then reload in chrome://extensions (click the ↺ refresh icon)
```

Requires **Node.js 18+**.

---

## ✨ Full Feature List

| Feature | Details |
|---|---|
| **Side Panel** | Opens as full-height panel alongside any page — not a tiny popup |
| **Auto URL Detection** | Reads your active tab URL on open, switches to that page's chat |
| **Global Chat** | Chat with anyone on the same page. Switch across 5 seeded demo URLs |
| **AI Summary** | Claude-style key-point summaries of the current page conversation |
| **Direct Messages** | Private DMs with full conversation history, unread badges |
| **Groups** | Join/discover interest groups (public & private) |
| **Create Group** | Emoji picker, name, description, public/private — fully functional |
| **Group Chat** | Full real-time-style chat with emoji reactions, member list |
| **Group Info** | Members, admin badges, online status, join/leave |
| **Collections** | Organise URLs into named collections (max 8 collections, 10 URLs each) |
| **Create Collection** | Public/private, add/remove URLs with validation |
| **User Profiles** | View bio, interests, links, shared groups |
| **Follow System** | Follow/unfollow users with state persistence |
| **Block System** | Block users — shows blocked view on their profile, unblock from profile |
| **Report System** | Report with reason selection → confirmation flow |
| **Shared Groups** | Profiles show groups you both belong to |
| **Toast Notifications** | App-wide feedback for every action |
| **Auth Edge Cases** | Email taken, weak password, username taken, account lockout |
| **Settings** | Profile edit (bio limit, link limit), privacy toggles, notifications |
| **Account Settings** | Deactivate (reversible) + Delete (type-to-confirm, permanent) |
| **Unread Badge** | Extension icon shows DM unread count |

---

## 🧑‍💻 Demo Credentials

Any password works (type `wrong...` to trigger error states):

| Username | Character |
|---|---|
| `varun_dev` | Default logged-in user |
| `yuki_design` | Designer — try blocking/reporting |
| `arjun_code` | Full-stack dev |
| `priya_ml` | ML researcher |
| `meera_writes` | Technical writer |
| `rahul_infra` | DevOps |
| `lena_ux` | Product designer |
| `codenerd42` | Systems programmer |

### Edge case triggers (in Sign Up / Sign In):
- Email containing `taken` → "Email already exists" error
- Password starting with `wrong` → wrong password error
- 5 consecutive failed logins → account locked message
- Username matching existing user → "taken, try X_42" suggestion
- Common passwords (e.g. `password`) → strength warning

---

## 📁 Dist Structure

```
dist/
├── manifest.json         ← Manifest V3 with sidePanel permission
├── sidepanel.html        ← Side panel entry point
├── background.js         ← Service worker (opens panel on click, badge counts)
├── content.js            ← Injected into pages (reads active tab URL)
├── icons/                ← 16/32/48/128px icons
└── assets/
    ├── sidepanel-[hash].js
    └── sidepanel-[hash].css
```

---

## 🛠 Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 **MemoryRouter** |
| State | Zustand (with localStorage persistence) |
| Styling | Tailwind CSS v3 + Nunito Sans |
| Animation | Framer Motion |
| Extension API | Manifest V3 · `chrome.sidePanel` · background service worker |
| Build | `npm run build` → `dist/` → Load Unpacked |

---

## 🔌 Plugging in a Real Backend

Each store maps directly to a backend call:

```js
// chatStore.sendMessage() → Supabase Realtime
await supabase.channel(`url:${activeUrl}`).send({ type: 'broadcast', event: 'msg', payload: msg })

// groupStore.createGroup() → insert row
await supabase.from('groups').insert({ name, description, emoji, is_public })

// socialStore.blockUser() → insert block record
await supabase.from('blocks').insert({ blocker_id: me.id, blocked_id: userId })
```

---

*Skysurf v1.0.0 — Side Panel Edition*
