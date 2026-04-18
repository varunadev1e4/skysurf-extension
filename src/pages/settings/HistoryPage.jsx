import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ExternalLink, Search, Trash2, Filter, X } from 'lucide-react'
import TopBar from '../../components/layout/TopBar'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { toast } from '../../components/ui/Toast'
import { URLS, GLOBAL_MESSAGES } from '../../data/dummy'
import { timeAgo } from '../../utils/time'

const TOPICS = ['All', 'Dev', 'Design', 'AI', 'Discussion']

const INITIAL_HISTORY = URLS.map(url => {
  const msgs = GLOBAL_MESSAGES[url.id] || []
  const last = msgs[msgs.length - 1]
  return {
    id: url.id, url: url.id, label: url.label,
    messageCount: msgs.length,
    lastAt: last?.time || new Date(Date.now() - Math.random() * 864000000).toISOString(),
    topic: ['Dev', 'Design', 'AI', 'Discussion'][Math.floor(Math.random() * 4)],
  }
}).filter(h => h.messageCount > 0)

export default function HistoryPage() {
  const navigate  = useNavigate()
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [search,  setSearch]  = useState('')
  const [topic,   setTopic]   = useState('All')
  const [showClear, setClear] = useState(false)

  const filtered = history.filter(h => {
    const matchSearch = !search || h.label.toLowerCase().includes(search.toLowerCase())
    const matchTopic  = topic === 'All' || h.topic === topic
    return matchSearch && matchTopic
  })

  const deleteItem = (id) => {
    setHistory(h => h.filter(item => item.id !== id))
    toast.info('History item removed')
  }

  const clearAll = () => {
    setHistory([])
    setClear(false)
    toast.info('History cleared')
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title="History"
        back="/settings"
        right={
          history.length > 0 && (
            <button onClick={() => setClear(true)} className="text-white/80 hover:text-white transition-colors">
              <Trash2 size={17} />
            </button>
          )
        }
      />

      {/* Search */}
      <div className="px-3 py-2 border-b border-brand-border flex-shrink-0">
        <div className="flex items-center gap-2 bg-brand-surface border border-brand-border rounded-lg px-2.5 py-1.5">
          <Search size={13} className="text-brand-mute flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search history…"
            className="flex-1 text-xs font-medium bg-transparent outline-none text-gray-800 placeholder:text-brand-mute" />
          {search && (
            <button onClick={() => setSearch('')}><X size={13} className="text-brand-mute" /></button>
          )}
        </div>
      </div>

      {/* Topic filter */}
      <div className="flex gap-2 px-3 py-2 border-b border-brand-border overflow-x-auto scroll-hide flex-shrink-0">
        <Filter size={12} className="text-brand-mute flex-shrink-0 mt-0.5" />
        {TOPICS.map(t => (
          <button key={t} onClick={() => setTopic(t)}
            className={`text-[10px] font-bold rounded-full px-2.5 py-1 border transition-colors whitespace-nowrap flex-shrink-0 ${topic === t ? 'bg-brand-deep text-white border-brand-deep' : 'bg-brand-surface border-brand-border text-brand-mute hover:border-brand-mid'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto thin-scroll">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-brand-mute gap-2">
            <Clock size={32} />
            <p className="font-bold text-sm">{history.length === 0 ? 'No history yet' : 'No results'}</p>
            <p className="text-xs">URLs you chat on will appear here.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3.5 border-b border-brand-border hover:bg-brand-surface transition-colors group">
              <button onClick={() => navigate('/chat')} className="flex items-center gap-3 flex-1 min-w-0 text-left">
                <div className="w-9 h-9 rounded-xl bg-brand-light flex items-center justify-center flex-shrink-0">
                  <ExternalLink size={15} className="text-brand-deep" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{item.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-brand-mute">{item.messageCount} messages</span>
                    <span className="w-1 h-1 rounded-full bg-brand-mute" />
                    <span className="text-[10px] text-brand-mute">{timeAgo(item.lastAt)}</span>
                    <span className="text-[10px] font-bold text-brand-mid bg-brand-light rounded-full px-1.5 py-0.5">{item.topic}</span>
                  </div>
                </div>
              </button>
              <button onClick={() => deleteItem(item.id)}
                className="opacity-0 group-hover:opacity-100 text-brand-mute hover:text-red-500 transition-all flex-shrink-0">
                <X size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal open={showClear} onClose={() => setClear(false)} title="Clear All History?">
        <div className="px-5 py-4">
          <p className="text-sm text-brand-mute mb-4">This will remove all {history.length} history items. This cannot be undone.</p>
          <div className="flex flex-col gap-2">
            <Button variant="danger" onClick={clearAll}>Clear All History</Button>
            <Button variant="ghost" onClick={() => setClear(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
