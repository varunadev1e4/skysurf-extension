// Skysurf Background Service Worker (Manifest V3 — Side Panel)

// Open side panel when toolbar icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  await chrome.sidePanel.open({ tabId: tab.id })
})

// Allow side panel on every tab by default
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {})
})

// Badge management
function updateBadge(count) {
  const text = count > 0 ? (count > 9 ? '9+' : String(count)) : ''
  chrome.action.setBadgeText({ text })
  if (count > 0) chrome.action.setBadgeBackgroundColor({ color: '#FF3D00' })
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'SET_BADGE') {
    updateBadge(msg.count)
    sendResponse({ ok: true })
  }
  if (msg.type === 'GET_ACTIVE_TAB_URL') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0]
      const url = (tab?.url || '').replace(/^https?:\/\//, '').replace(/\/$/, '')
      sendResponse({ url, title: tab?.title || '', tabId: tab?.id })
    })
    return true
  }
})
