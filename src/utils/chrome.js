// Safe Chrome API bridge — works in extension AND in npm run dev (web mode)

const isChromeExt = typeof chrome !== 'undefined' && !!chrome?.runtime?.id

export const isExtension = isChromeExt

/**
 * Get the active tab's URL. In web mode returns a mock URL.
 */
export async function getActiveTabUrl() {
  if (!isChromeExt) {
    // Dev mode — return mock URL based on current page
    return {
      url:   'github.com/vercel/next.js',
      host:  'github.com',
      title: 'vercel/next.js · GitHub',
    }
  }

  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: 'GET_ACTIVE_TAB_URL' }, (res) => {
      if (chrome.runtime.lastError || !res) {
        resolve({ url: '', host: '', title: '' })
      } else {
        resolve(res)
      }
    })
  })
}

/**
 * Set the action badge count (unread DMs)
 */
export function setBadgeCount(count) {
  if (!isChromeExt) return
  chrome.runtime.sendMessage({ type: 'SET_BADGE', count })
}

/**
 * Chrome storage — falls back to localStorage in dev mode
 */
export const extStorage = {
  get: async (key) => {
    if (!isChromeExt) {
      try { return JSON.parse(localStorage.getItem(key)) } catch { return null }
    }
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (res) => resolve(res[key] ?? null))
    })
  },
  set: async (key, value) => {
    if (!isChromeExt) {
      localStorage.setItem(key, JSON.stringify(value))
      return
    }
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve)
    })
  },
}
