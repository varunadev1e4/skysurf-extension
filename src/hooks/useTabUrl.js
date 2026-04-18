import { useEffect } from 'react'
import { getActiveTabUrl } from '../utils/chrome'
import useChatStore from '../store/chatStore'
import { URLS } from '../data/dummy'

/**
 * On extension popup open, reads the active tab URL and
 * sets it as the active chat URL if it matches known URLs,
 * or adds it as a dynamic URL entry.
 */
export function useTabUrl() {
  const { setActiveUrl, addDynamicUrl } = useChatStore()

  useEffect(() => {
    getActiveTabUrl().then(({ url, host, title }) => {
      if (!url) return

      // Check if it matches an existing known URL
      const match = URLS.find(u =>
        url.startsWith(u.id) || u.id.startsWith(host)
      )

      if (match) {
        setActiveUrl(match.id)
      } else if (host) {
        // Add as a live dynamic URL entry
        addDynamicUrl({ id: url, label: url, host, title, online: 1 })
        setActiveUrl(url)
      }
    })
  }, [])
}
