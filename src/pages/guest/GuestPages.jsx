import GuestGate from '../../components/ui/GuestGate'
import BottomNav from '../../components/layout/BottomNav'

export function GuestGroupsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      <GuestGate section="groups" back="/chat" />
      <BottomNav />
    </div>
  )
}

export function GuestCollectionsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      <GuestGate section="collections" back="/chat" />
      <BottomNav />
    </div>
  )
}

export function GuestSettingsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      <GuestGate section="settings" back="/chat" />
      <BottomNav />
    </div>
  )
}

export function GuestDmsPage() {
  return (
    <div className="flex flex-col h-full bg-white">
      <GuestGate section="dms" back="/chat" />
      <BottomNav />
    </div>
  )
}
