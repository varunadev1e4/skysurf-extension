import { create } from 'zustand'
import { COLLECTIONS } from '../data/dummy'
import { nanoid } from '../utils/nanoid'

const useCollectionStore = create((set, get) => ({
  collections: { ...COLLECTIONS },

  createCollection: ({ name, isPublic }) => {
    const id = 'c' + nanoid()
    const col = {
      id,
      name,
      isPublic,
      urls: [],
      createdAt: new Date().toISOString(),
    }
    set(s => ({ collections: { ...s.collections, [id]: col } }))
    return id
  },

  deleteCollection: (id) => {
    set(s => {
      const next = { ...s.collections }
      delete next[id]
      return { collections: next }
    })
  },

  addUrl: (collectionId, url) => {
    // Check max 10 and no duplicate
    const col = get().collections[collectionId]
    if (!col) return { error: 'Collection not found' }
    if (col.urls.length >= 10) return { error: 'Collection is full (10/10 max)' }
    if (col.urls.find(u => u.url === url)) return { error: 'URL already in collection' }

    const entry = { id: nanoid(), url, addedAt: new Date().toISOString() }
    set(s => ({
      collections: {
        ...s.collections,
        [collectionId]: { ...col, urls: [...col.urls, entry] }
      }
    }))
    return { success: true }
  },

  removeUrl: (collectionId, urlId) => {
    set(s => {
      const col = s.collections[collectionId]
      if (!col) return s
      return {
        collections: {
          ...s.collections,
          [collectionId]: { ...col, urls: col.urls.filter(u => u.id !== urlId) }
        }
      }
    })
  },

  toggleVisibility: (collectionId) => {
    set(s => {
      const col = s.collections[collectionId]
      if (!col) return s
      return {
        collections: {
          ...s.collections,
          [collectionId]: { ...col, isPublic: !col.isPublic }
        }
      }
    })
  },
}))

export default useCollectionStore
