// ─── USERS ───────────────────────────────────────────────────────────────────
export const USERS = {
  u1: { id: 'u1', username: 'varun_dev', displayName: 'Varun', bio: 'Building cool things on the web. Warangal 🇮🇳', avatar: null, initials: 'V', interests: ['React', 'Startups', 'Coffee'], joinedAt: '2024-01-15', online: true, links: ['github.com/varun', 'varun.dev'] },
  u2: { id: 'u2', username: 'yuki_design', displayName: 'Yuki', bio: 'UI/UX designer & front-end dev. Tokyo 🇯🇵', avatar: null, initials: 'Y', interests: ['Design', 'Figma', 'CSS'], joinedAt: '2024-02-01', online: true, links: ['dribbble.com/yuki'] },
  u3: { id: 'u3', username: 'arjun_code', displayName: 'Arjun', bio: 'Full stack engineer. Building at speed.', avatar: null, initials: 'A', interests: ['Node', 'Postgres', 'DevOps'], joinedAt: '2024-01-20', online: false, links: [] },
  u4: { id: 'u4', username: 'priya_ml', displayName: 'Priya', bio: 'ML researcher & occasional blogger. Chennai 🇮🇳', avatar: null, initials: 'P', interests: ['AI/ML', 'Python', 'Research'], joinedAt: '2024-03-05', online: true, links: ['priya.substack.com'] },
  u5: { id: 'u5', username: 'meera_writes', displayName: 'Meera', bio: 'Technical writer & open source contributor.', avatar: null, initials: 'M', interests: ['Writing', 'Open Source', 'Rust'], joinedAt: '2024-02-18', online: false, links: [] },
  u6: { id: 'u6', username: 'rahul_infra', displayName: 'Rahul', bio: 'DevOps / platform eng. Cloud costs are my nemesis.', avatar: null, initials: 'R', interests: ['Kubernetes', 'AWS', 'Terraform'], joinedAt: '2024-01-30', online: true, links: [] },
  u7: { id: 'u7', username: 'lena_ux', displayName: 'Lena', bio: 'Product designer at a Berlin startup. Figma addict.', avatar: null, initials: 'L', interests: ['Product', 'Figma', 'Motion'], joinedAt: '2024-04-01', online: true, links: ['lena.design'] },
  u8: { id: 'u8', username: 'codenerd42', displayName: 'CodeNerd', bio: 'Systems programmer. I write Rust for fun.', avatar: null, initials: 'C', interests: ['Rust', 'Systems', 'WebAssembly'], joinedAt: '2024-03-22', online: false, links: [] },
}

export const CURRENT_USER_ID = 'u1'

// Avatar color map (gradient per user)
export const AVATAR_COLORS = {
  u1: ['#06558D', '#1B76B8'],
  u2: ['#7C3AED', '#A78BFA'],
  u3: ['#059669', '#34D399'],
  u4: ['#DC2626', '#F87171'],
  u5: ['#D97706', '#FCD34D'],
  u6: ['#0891B2', '#67E8F9'],
  u7: ['#BE185D', '#F9A8D4'],
  u8: ['#374151', '#9CA3AF'],
}

// ─── URL CHATS ────────────────────────────────────────────────────────────────
export const URLS = [
  { id: 'github.com/vercel/next.js',    label: 'github.com/vercel/next.js',    online: 3 },
  { id: 'stackoverflow.com/q/react',    label: 'stackoverflow.com',            online: 7 },
  { id: 'figma.com/community',          label: 'figma.com/community',          online: 12 },
  { id: 'reddit.com/r/programming',     label: 'reddit.com/r/programming',     online: 29 },
  { id: 'docs.anthropic.com',           label: 'docs.anthropic.com',           online: 5 },
]

const t = (mins) => new Date(Date.now() - mins * 60000).toISOString()

export const GLOBAL_MESSAGES = {
  'github.com/vercel/next.js': [
    { id: 'm1', userId: 'u2', text: 'Anyone else notice the sidebar changed in the new update?', time: t(8), reacts: { '👍': ['u3','u4'] } },
    { id: 'm2', userId: 'u3', text: 'Yeah feels different. Nav moved left again.', time: t(7), reacts: {} },
    { id: 'm3', userId: 'u4', text: 'The new layout update just rolled out this morning.', time: t(5), reacts: { '🔥': ['u2'] } },
    { id: 'm4', userId: 'u2', text: 'Is the dark mode toggle still buried in settings?', time: t(2), reacts: {} },
    { id: 'm5', userId: 'u6', text: 'App router is getting really solid now. Migration was worth it.', time: t(1), reacts: { '👍': ['u2','u3','u4'] } },
  ],
  'stackoverflow.com/q/react': [
    { id: 'm6',  userId: 'u8', text: 'useEffect cleanup is so confusing at first tbh', time: t(15), reacts: { '👍': ['u2','u3','u4','u5'] } },
    { id: 'm7',  userId: 'u5', text: 'The deps array tripped me up for literal weeks', time: t(12), reacts: { '😂': ['u3','u8'] } },
    { id: 'm8',  userId: 'u3', text: 'React docs finally updated their examples. Much clearer now.', time: t(8), reacts: {} },
    { id: 'm9',  userId: 'u8', text: 'Strict mode double-fires effects on purpose btw. Caught me off guard.', time: t(3), reacts: { '🤯': ['u2','u4','u5'] } },
  ],
  'figma.com/community': [
    { id: 'm10', userId: 'u7', text: 'Anyone using the new variables feature properly yet?', time: t(20), reacts: { '👍': ['u2','u3','u4','u5','u6','u8'] } },
    { id: 'm11', userId: 'u4', text: 'Variables are a game changer for design tokens', time: t(15), reacts: { '🔥': ['u7','u2','u3'] } },
    { id: 'm12', userId: 'u2', text: 'Auto layout v5 is also massive. Wrapping finally works right.', time: t(8), reacts: { '👍': ['u7'] } },
    { id: 'm13', userId: 'u7', text: 'The community file for icons got 50k likes last week 🙃', time: t(2), reacts: { '🎉': ['u2','u4'] } },
  ],
  'reddit.com/r/programming': [
    { id: 'm14', userId: 'u8', text: 'Rust is eating C++ mindshare faster than I expected', time: t(30), reacts: { '👍': ['u3','u4','u5','u6','u7','u2','u1'] } },
    { id: 'm15', userId: 'u4', text: 'TypeScript doing the same thing to vanilla JS', time: t(22), reacts: { '🔥': ['u2','u8','u3','u6','u7'] } },
    { id: 'm16', userId: 'u6', text: 'Go still my favourite for backend services. Simple is underrated.', time: t(14), reacts: {} },
    { id: 'm17', userId: 'u8', text: 'Zig is very interesting. I am watching it closely.', time: t(5), reacts: { '👀': ['u3','u4','u6'] } },
  ],
  'docs.anthropic.com': [
    { id: 'm18', userId: 'u3', text: 'Tool use examples are really well documented here', time: t(25), reacts: { '👍': ['u4','u5','u7'] } },
    { id: 'm19', userId: 'u5', text: 'The prompt caching section saved us a lot of API cost', time: t(18), reacts: { '🔥': ['u3','u6'] } },
    { id: 'm20', userId: 'u6', text: 'Context window limits still trip me up sometimes', time: t(10), reacts: {} },
    { id: 'm21', userId: 'u3', text: 'The cookbook repo has great worked examples. Recommend.', time: t(1), reacts: {} },
  ],
}

// ─── DMs ─────────────────────────────────────────────────────────────────────
export const DM_CONVERSATIONS = {
  u2: {
    userId: 'u2',
    messages: [
      { id: 'd1', from: 'u2', text: 'Hey! Love what you shared in the Figma community chat 🙌', time: t(120) },
      { id: 'd2', from: 'u1', text: 'Thanks! Variables finally clicked for me last week', time: t(118) },
      { id: 'd3', from: 'u2', text: 'Same. I rebuilt our whole token system with them. So much cleaner.', time: t(116) },
      { id: 'd4', from: 'u1', text: 'Would love to see how you structured it sometime', time: t(115) },
      { id: 'd5', from: 'u2', text: 'Sure! I can share the file. Give me a bit 😊', time: t(110) },
    ],
    unread: 0,
  },
  u4: {
    userId: 'u4',
    messages: [
      { id: 'd6', from: 'u4', text: 'Saw your comment on the Anthropic docs thread — are you building something with Claude?', time: t(60) },
      { id: 'd7', from: 'u1', text: 'Yeah working on a local AI assistant for my workflow. Early days.', time: t(58) },
      { id: 'd8', from: 'u4', text: 'Interesting! What stack?', time: t(57) },
      { id: 'd9', from: 'u1', text: 'React + Supabase frontend, Claude API on the edge', time: t(56) },
      { id: 'd10', from: 'u4', text: 'Nice combo. Let me know how the latency holds up 👍', time: t(30) },
    ],
    unread: 1,
  },
  u6: {
    userId: 'u6',
    messages: [
      { id: 'd11', from: 'u6', text: 'Quick question — how are you handling auth in your PWA?', time: t(240) },
      { id: 'd12', from: 'u1', text: 'Supabase auth with RLS. Works great for solo projects.', time: t(235) },
      { id: 'd13', from: 'u6', text: 'Good call. We moved away from self-hosted Postgres and it was worth it.', time: t(230) },
    ],
    unread: 0,
  },
  u8: {
    userId: 'u8',
    messages: [
      { id: 'd14', from: 'u8', text: 'You should really try Rust for your next CLI tool', time: t(1440) },
      { id: 'd15', from: 'u1', text: 'haha one day. The borrow checker still scares me', time: t(1430) },
      { id: 'd16', from: 'u8', text: 'That is the point — it teaches you to write correct code from the start', time: t(1425) },
      { id: 'd17', from: 'u8', text: 'Spent the weekend on a new parser. Check it out when I push it', time: t(20) },
    ],
    unread: 2,
  },
}

// ─── GROUPS ───────────────────────────────────────────────────────────────────
export const GROUPS = {
  g1: {
    id: 'g1',
    name: 'React Builders',
    description: 'Share your React projects, questions, and discoveries. All levels welcome.',
    emoji: '⚛️',
    memberCount: 42,
    isPublic: true,
    members: ['u1','u2','u3','u4','u5'],
    admins: ['u3'],
    createdAt: '2024-01-20',
    joined: true,
    messages: [
      { id: 'gm1', userId: 'u3', text: 'Anyone tried React 19 RC yet? The new compiler is wild.', time: t(45), reacts: { '🔥': ['u1','u2','u4'] } },
      { id: 'gm2', userId: 'u2', text: 'I did! The automatic memoisation saves so many renders.', time: t(40), reacts: { '👍': ['u3','u5'] } },
      { id: 'gm3', userId: 'u1', text: 'Does it work well with Zustand stores?', time: t(35), reacts: {} },
      { id: 'gm4', userId: 'u3', text: 'Mostly yes. Had one issue with subscriptions but fixed with a selector.', time: t(30), reacts: {} },
      { id: 'gm5', userId: 'u4', text: 'The Actions API is the real standout for me. Async transitions ❤️', time: t(10), reacts: { '👍': ['u1','u2','u3'] } },
    ],
  },
  g2: {
    id: 'g2',
    name: 'Design Systems',
    description: 'Discussing component libraries, tokens, Figma, and the intersection of design & code.',
    emoji: '🎨',
    memberCount: 28,
    isPublic: true,
    members: ['u1','u2','u7'],
    admins: ['u7'],
    createdAt: '2024-02-10',
    joined: true,
    messages: [
      { id: 'gm6',  userId: 'u7', text: 'What is everyone using for their token pipeline in 2024?', time: t(90), reacts: {} },
      { id: 'gm7',  userId: 'u2', text: 'Style Dictionary + Figma Variables. Painful to set up but worth it.', time: t(85), reacts: { '👍': ['u7'] } },
      { id: 'gm8',  userId: 'u1', text: 'We went Tailwind config only — smaller team so kept it simple.', time: t(80), reacts: {} },
      { id: 'gm9',  userId: 'u7', text: 'Fair. For 3 people Tailwind config is totally fine.', time: t(75), reacts: {} },
    ],
  },
  g3: {
    id: 'g3',
    name: 'Indie Hackers IN',
    description: 'Indian indie hackers building products. Celebrate wins, share learnings, no spam.',
    emoji: '🚀',
    memberCount: 67,
    isPublic: false,
    members: ['u1','u3','u4','u6'],
    admins: ['u1'],
    createdAt: '2024-01-15',
    joined: true,
    messages: [
      { id: 'gm10', userId: 'u1', text: 'Shipped v1 of Skysurf today! Feel free to roast the landing page 😅', time: t(200), reacts: { '🎉': ['u3','u4','u6'] } },
      { id: 'gm11', userId: 'u4', text: 'Congrats!! What is the traction looking like?', time: t(190), reacts: {} },
      { id: 'gm12', userId: 'u1', text: '47 signups in first 6 hours organically. Happy with that.', time: t(185), reacts: { '🔥': ['u3','u4','u6'] } },
      { id: 'gm13', userId: 'u6', text: 'Did you post on HN?', time: t(180), reacts: {} },
      { id: 'gm14', userId: 'u1', text: 'Not yet — planning for tomorrow morning IST when traffic is good', time: t(170), reacts: {} },
    ],
  },
  g4: {
    id: 'g4',
    name: 'AI Tools Watch',
    description: 'Tracking the AI tools landscape. New models, APIs, and product launches.',
    emoji: '🤖',
    memberCount: 89,
    isPublic: false,
    members: ['u1','u4','u5','u6','u8'],
    admins: ['u4'],
    createdAt: '2024-03-01',
    joined: true,
    messages: [
      { id: 'gm15', userId: 'u4', text: 'Claude 3.5 Sonnet extended context is really impressive for long documents', time: t(300), reacts: { '👍': ['u1','u5','u6','u8'] } },
      { id: 'gm16', userId: 'u8', text: 'Been using it for code review. Catches things I miss.', time: t(280), reacts: {} },
      { id: 'gm17', userId: 'u5', text: 'The new prompt caching feature is a 10x cost reduction for our use case', time: t(260), reacts: { '🔥': ['u1','u4','u8'] } },
    ],
  },
  g5: {
    id: 'g5',
    name: 'Figma Plugin Dev',
    description: 'Building Figma plugins? This is your place. Share code, bugs, and releases.',
    emoji: '🔌',
    memberCount: 15,
    isPublic: true,
    members: ['u2','u7'],
    admins: ['u2'],
    createdAt: '2024-04-15',
    joined: false,
    messages: [],
  },
  g6: {
    id: 'g6',
    name: 'Weekend Hackers',
    description: 'Show off your weekend side projects. No idea too small.',
    emoji: '🛠️',
    memberCount: 34,
    isPublic: true,
    members: ['u3','u6','u8'],
    admins: ['u6'],
    createdAt: '2024-02-25',
    joined: false,
    messages: [],
  },
}

// ─── COLLECTIONS ─────────────────────────────────────────────────────────────
export const COLLECTIONS = {
  c1: {
    id: 'c1',
    name: 'Dev Tools',
    isPublic: true,
    urls: [
      { id: 'cu1', url: 'github.com', addedAt: t(2880) },
      { id: 'cu2', url: 'vercel.com', addedAt: t(1440) },
      { id: 'cu3', url: 'npmjs.com', addedAt: t(720) },
      { id: 'cu4', url: 'figma.com', addedAt: t(360) },
      { id: 'cu5', url: 'stackoverflow.com', addedAt: t(120) },
    ],
    createdAt: t(5760),
  },
  c2: {
    id: 'c2',
    name: 'AI Resources',
    isPublic: false,
    urls: [
      { id: 'cu6', url: 'docs.anthropic.com', addedAt: t(720) },
      { id: 'cu7', url: 'openai.com/docs', addedAt: t(480) },
      { id: 'cu8', url: 'huggingface.co', addedAt: t(240) },
    ],
    createdAt: t(2880),
  },
  c3: {
    id: 'c3',
    name: 'Blogs I Love',
    isPublic: true,
    urls: [
      { id: 'cu9',  url: 'overreacted.io', addedAt: t(5760) },
      { id: 'cu10', url: 'paulgraham.com', addedAt: t(4320) },
      { id: 'cu11', url: 'newsletter.pragmaticengineer.com', addedAt: t(2880) },
    ],
    createdAt: t(10080),
  },
}

// ─── AI SUMMARIES ─────────────────────────────────────────────────────────────
export const AI_SUMMARIES = {
  'github.com/vercel/next.js': {
    keyPoints: [
      'Users are discussing the recent sidebar navigation changes in the latest update',
      'The new App Router layout has moved key navigation elements to the left panel',
      'Dark mode toggle location is a common confusion point for new users',
      'General sentiment is positive about the App Router improvements',
    ],
    mood: 'Curious',
    topUser: 'u6',
  },
  'stackoverflow.com/q/react': {
    keyPoints: [
      'Conversation centres around React hooks, specifically useEffect complexity',
      'The dependency array behaviour is the top confusion point among developers',
      'React Strict Mode\'s double-invocation behaviour was highlighted and clarified',
      'Community sentiment is helpful and patient with learners',
    ],
    mood: 'Educational',
    topUser: 'u8',
  },
  'figma.com/community': {
    keyPoints: [
      'Figma Variables feature is the hottest topic — designers rebuilding token systems',
      'Auto Layout v5 wrapping improvements received very positive reception',
      'Community file sharing continues to be a major engagement driver',
      'Both designers and developers are actively participating in the discussion',
    ],
    mood: 'Excited',
    topUser: 'u7',
  },
}
