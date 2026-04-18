// Skysurf Content Script
// Runs on every page — sends the clean URL to the popup when requested

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'GET_PAGE_URL') {
    const clean = window.location.href
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '')
    sendResponse({
      url:   clean,
      host:  window.location.hostname,
      path:  window.location.pathname,
      title: document.title,
    })
  }
})
