import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Globe, Lock, Trash2, ExternalLink, X, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import TopBar from '../../components/layout/TopBar'
import BottomNav from '../../components/layout/BottomNav'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Tag, Toggle } from '../../components/ui/Tag'
import { toast } from '../../components/ui/Toast'
import useCollectionStore from '../../store/collectionStore'
import useAuthStore from '../../store/authStore'
import GuestGate from '../../components/layout/GuestGate'
import { timeAgo } from '../../utils/time'

const MAX_COLLECTIONS = 8
const MAX_URLS = 10

function validateUrl(raw) {
  if (!raw.trim()) return 'URL cannot be empty'
  const clean = raw.trim().replace(/^https?:\/\//, '')
  if (clean.includes(' ')) return 'URL cannot contain spaces'
  if (!clean.includes('.')) return 'Enter a valid URL (e.g. github.com)'
  if (clean.length > 200) return 'URL is too long'
  return null
}

function CollectionCard({ col }) {
  const { removeUrl, toggleVisibility, deleteCollection, addUrl: storeAddUrl } = useCollectionStore()
  const [expanded, setExpanded] = useState(false)
  const [addUrlInput, setAddUrlInput] = useState('')
  const [addError, setAddError] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  const handleAddUrl = () => {
    setAddError('')
    const raw = addUrlInput.trim().replace(/^https?:\/\//, '').replace(/\/$/, '')
    const err = validateUrl(raw)
    if (err) return setAddError(err)
    const result = storeAddUrl(col.id, raw)
    if (result?.error) return setAddError(result.error)
    setAddUrlInput('')
    toast.success('URL added')
  }

  const handleDelete = () => {
    deleteCollection(col.id)
    toast.info(`"${col.name}" deleted`)
    setShowDelete(false)
  }

  const isFull = col.urls.length >= MAX_URLS

  return (
    <motion.div layout className="border border-brand-border rounded-2xl overflow-hidden mb-2.5">
      <button onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-brand-surface transition-colors text-left">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-extrabold text-sm text-gray-900">{col.name}</span>
            {col.isPublic ? <Globe size={11} className="text-brand-mute"/> : <Lock size={11} className="text-brand-mute"/>}
            {isFull && <Tag variant="red" className="text-[9px]">FULL</Tag>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-brand-mute font-semibold">{col.urls.length}/{MAX_URLS} URLs</span>
            <span className="w-1 h-1 rounded-full bg-brand-mute"/>
            <span className="text-[10px] text-brand-mute">{timeAgo(col.createdAt)}</span>
          </div>
        </div>
        <span className={`text-brand-mute text-xs transition-transform ${expanded ? 'rotate-180' : ''}`}>↓</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-4 pb-4 border-t border-brand-border">
              {/* URL list */}
              <div className="mt-3 mb-3">
                {col.urls.length === 0 ? (
                  <div className="py-4 text-center">
                    <p className="text-xs text-brand-mute italic">No URLs yet. Add one below.</p>
                  </div>
                ) : (
                  col.urls.map(entry => (
                    <div key={entry.id} className="flex items-center gap-2 py-1.5 border-b border-brand-border last:border-0">
                      <ExternalLink size={11} className="text-brand-mute flex-shrink-0"/>
                      <span className="flex-1 text-xs font-semibold text-gray-700 truncate">{entry.url}</span>
                      <span className="text-[10px] text-brand-mute whitespace-nowrap">{timeAgo(entry.addedAt)}</span>
                      <button onClick={() => { removeUrl(col.id, entry.id); toast.info('URL removed') }}
                        className="text-brand-mute hover:text-red-500 transition-colors flex-shrink-0">
                        <X size={13}/>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add URL */}
              {isFull ? (
                <div className="border-2 border-dashed border-brand-border rounded-lg p-2.5 text-center">
                  <p className="text-xs text-brand-mute font-semibold">Collection full (10/10). Remove a URL to add new ones.</p>
                </div>
              ) : (
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input placeholder="Add URL (e.g. figma.com)"
                      value={addUrlInput} onChange={e => setAddUrlInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
                      className={`w-full border rounded-lg px-3 py-2 text-xs font-medium outline-none transition-all ${addError ? 'border-red-400' : 'border-brand-border focus:border-brand-mid focus:ring-2 focus:ring-brand-light'}`}/>
                    {addError && <p className="text-[10px] text-red-500 font-semibold mt-1">{addError}</p>}
                  </div>
                  <button onClick={handleAddUrl}
                    className="bg-brand-orange text-white text-xs font-bold rounded-lg px-3 py-2 hover:bg-brand-orange-light transition-colors whitespace-nowrap flex-shrink-0">
                    + Add
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-brand-border">
                <div className="flex items-center gap-2">
                  <Toggle on={col.isPublic} onChange={() => { toggleVisibility(col.id); toast.info(col.isPublic ? 'Set to private' : 'Set to public') }}/>
                  <span className="text-xs font-semibold text-brand-mute">{col.isPublic ? 'Public' : 'Private'}</span>
                </div>
                <button onClick={() => setShowDelete(true)}
                  className="flex items-center gap-1 text-xs text-red-500 font-bold hover:text-red-700 transition-colors">
                  <Trash2 size={12}/> Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Collection">
        <div className="px-5 py-4">
          <p className="text-sm text-gray-700 mb-4">Delete <strong>"{col.name}"</strong>? This will remove all {col.urls.length} URLs and cannot be undone.</p>
          <div className="flex flex-col gap-2">
            <Button variant="danger" onClick={handleDelete}>Yes, Delete</Button>
            <Button variant="ghost" onClick={() => setShowDelete(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  )
}

export default function CollectionsPage() {
  const navigate = useNavigate()
  const collections = useCollectionStore(s => s.collections)
  const { createCollection } = useCollectionStore()
  const { isAuthenticated } = useAuthStore()

  const [showCreate, setCreate] = useState(false)
  const [name, setName]         = useState('')
  const [isPublic, setPublic]   = useState(true)
  const [nameError, setNameError] = useState('')
  const [creating, setCreating]   = useState(false)

  if (!isAuthenticated) return <GuestGate feature="collections" />

  const colList = Object.values(collections)
  const atMax   = colList.length >= MAX_COLLECTIONS

  const handleCreate = () => {
    if (!name.trim())     return setNameError('Collection name is required')
    if (name.length < 2)  return setNameError('Name must be at least 2 characters')
    if (name.length > 40) return setNameError('Name too long (max 40 characters)')
    if (atMax)            return toast.error('Maximum 8 collections reached. Delete one first.')
    setCreating(true)
    setTimeout(() => {
      createCollection({ name: name.trim(), isPublic })
      setCreate(false)
      setName('')
      setNameError('')
      setCreating(false)
      toast.success(`"${name}" collection created!`)
    }, 400)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <TopBar
        title="Collections"
        right={
          <button onClick={() => atMax ? toast.error('Max 8 collections reached. Delete one first.') : (isAuthenticated ? setCreate(true) : navigate('/signin'))}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-colors ${atMax ? 'bg-white/10 opacity-50' : 'bg-white/20 hover:bg-white/30'}`}>
            <Plus size={18}/>
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto thin-scroll px-4 py-3">
        {atMax && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mb-3">
            <span className="text-amber-600 text-xs font-bold">Maximum 8 collections reached.</span>
            <span className="text-amber-500 text-[10px]">Delete one to create a new one.</span>
          </div>
        )}

        {colList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-brand-mute gap-2">
            <span className="text-4xl">📁</span>
            <p className="font-bold text-sm">No collections yet</p>
            <p className="text-xs text-center max-w-[200px]">Save your favourite URLs in organised collections.</p>
            <button onClick={() => isAuthenticated ? setCreate(true) : navigate('/signin')} className="mt-2 text-brand-orange font-bold text-sm">
              + Create your first collection
            </button>
          </div>
        ) : (
          colList.map(col => <CollectionCard key={col.id} col={col}/>)
        )}
      </div>

      <BottomNav/>

      <Modal open={showCreate} onClose={() => { setCreate(false); setNameError('') }} title="New Collection">
        <div className="px-5 py-4 flex flex-col gap-4">
          <Input label="Collection Name" placeholder="e.g. Dev Tools"
            value={name} onChange={e => setName(e.target.value)} error={nameError} autoFocus
            note={`${name.length}/40`}/>
          <div>
            <label className="text-[10px] font-bold text-brand-mute uppercase tracking-wide block mb-2">Visibility</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: true,  label: 'Public',  Icon: Globe, desc: 'Others can see' },
                { value: false, label: 'Private', Icon: Lock,  desc: 'Only you' },
              ].map(({ value, label, Icon, desc }) => (
                <button key={label} type="button" onClick={() => setPublic(value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${isPublic === value ? 'border-brand-orange bg-brand-orange-pale' : 'border-brand-border hover:border-brand-mid'}`}>
                  <Icon size={16} className={isPublic === value ? 'text-brand-orange' : 'text-brand-mute'}/>
                  <span className={`text-xs font-bold ${isPublic === value ? 'text-brand-orange' : 'text-gray-700'}`}>{label}</span>
                  <span className="text-[10px] text-brand-mute">{desc}</span>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleCreate} disabled={creating} size="lg">
            {creating ? 'Creating…' : 'Create Collection'}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
