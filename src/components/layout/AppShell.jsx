// Side panel fills the full browser side panel — no fixed dimensions needed
// In dev mode we show a centered mock shell
export default function AppShell({ children }) {
  if (import.meta.env.DEV) {
    return (
      <div className="min-h-screen bg-[#DDE6EE] flex items-start justify-center pt-6">
        <div style={{
          width: 400, height: '90vh', maxHeight: 720,
          overflow: 'hidden', borderRadius: 12,
          boxShadow: '0 20px 60px rgba(6,85,141,0.25)',
          display: 'flex', flexDirection: 'column', background: '#fff'
        }}>
          {children}
        </div>
      </div>
    )
  }
  // Side panel: full width × full height
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {children}
    </div>
  )
}
