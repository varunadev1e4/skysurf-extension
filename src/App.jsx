import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ToastContainer from './components/ui/Toast'
import useAuthStore from './store/authStore'

// Auth
import LandingPage           from './pages/auth/LandingPage'
import SignUpPage            from './pages/auth/SignUpPage'
import SignInPage            from './pages/auth/SignInPage'
import ForgotPasswordPage    from './pages/auth/ForgotPasswordPage'
import VerifyEmailPage       from './pages/auth/VerifyEmailPage'

// Chat
import GlobalChatPage        from './pages/chat/GlobalChatPage'
import DmListPage            from './pages/chat/DmListPage'
import DmChatPage            from './pages/chat/DmChatPage'
import AiSummaryPage         from './pages/chat/AiSummaryPage'

// Profile
import UserProfilePage       from './pages/profile/UserProfilePage'

// Groups
import GroupsPage            from './pages/groups/GroupsPage'
import GroupChatPage         from './pages/groups/GroupChatPage'
import GroupInfoPage         from './pages/groups/GroupInfoPage'

// Collections
import CollectionsPage       from './pages/collections/CollectionsPage'

// Settings
import SettingsPage          from './pages/settings/SettingsPage'
import ProfileSettingsPage   from './pages/settings/ProfileSettingsPage'
import PrivacySettingsPage   from './pages/settings/PrivacySettingsPage'
import NotificationsPage     from './pages/settings/NotificationsPage'
import HistoryPage           from './pages/settings/HistoryPage'
import AccountSettingsPage   from './pages/settings/AccountSettingsPage'
import NotificationsPageFull from './pages/notifications/NotificationsPage'

// Guest gates
import { GuestGroupsPage, GuestCollectionsPage, GuestSettingsPage, GuestDmsPage } from './pages/guest/GuestPages'

// ── Route guards ──────────────────────────────────────────────────────────────
// ProtectedRoute: must be signed in, else → /signin
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/signin" replace />
}

// AuthedOrGate: must be signed in, else → guest gate page
function AuthedOrGate({ children, gate }) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return isAuthenticated ? children : gate
}

export default function App() {
  return (
    <MemoryRouter initialEntries={['/']} initialIndex={0}>
      <AppShell>
        <ToastContainer />
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────────── */}
          <Route path="/"                      element={<LandingPage />} />
          <Route path="/signup"                element={<SignUpPage />} />
          <Route path="/signin"                element={<SignInPage />} />
          <Route path="/forgot-password"       element={<ForgotPasswordPage />} />
          <Route path="/verify-email"          element={<VerifyEmailPage />} />

          {/* ── Guest gates (BottomNav locked tabs navigate here) ─────────── */}
          <Route path="/guest/groups"          element={<GuestGroupsPage />} />
          <Route path="/guest/collections"     element={<GuestCollectionsPage />} />
          <Route path="/guest/settings"        element={<GuestSettingsPage />} />
          <Route path="/guest/dms"             element={<GuestDmsPage />} />

          {/* ── Chat — global is read-only for guests ──────────────────────── */}
          <Route path="/chat"                  element={<GlobalChatPage />} />
          <Route path="/chat/ai-summary"       element={<AiSummaryPage />} />

          {/* DM list — show guest gate if not authed */}
          <Route path="/chat/dms" element={
            <AuthedOrGate gate={<GuestDmsPage />}>
              <DmListPage />
            </AuthedOrGate>
          } />
          <Route path="/chat/dms/:userId"      element={<ProtectedRoute><DmChatPage /></ProtectedRoute>} />

          {/* ── Profile — viewable by guests (actions locked inline) ───────── */}
          <Route path="/profile/:userId"       element={<UserProfilePage />} />

          {/* ── Groups — gate for guests ───────────────────────────────────── */}
          <Route path="/groups" element={
            <AuthedOrGate gate={<GuestGroupsPage />}>
              <GroupsPage />
            </AuthedOrGate>
          } />
          <Route path="/groups/:groupId" element={
            <AuthedOrGate gate={<GuestGroupsPage />}>
              <GroupChatPage />
            </AuthedOrGate>
          } />
          <Route path="/groups/:groupId/info" element={
            <AuthedOrGate gate={<GuestGroupsPage />}>
              <GroupInfoPage />
            </AuthedOrGate>
          } />

          {/* ── Collections — gate for guests ─────────────────────────────── */}
          <Route path="/collections" element={
            <AuthedOrGate gate={<GuestCollectionsPage />}>
              <CollectionsPage />
            </AuthedOrGate>
          } />

          {/* ── Settings — gate for guests ────────────────────────────────── */}
          <Route path="/settings" element={
            <AuthedOrGate gate={<GuestSettingsPage />}>
              <SettingsPage />
            </AuthedOrGate>
          } />
          <Route path="/settings/profile"      element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
          <Route path="/settings/privacy"      element={<ProtectedRoute><PrivacySettingsPage /></ProtectedRoute>} />
          <Route path="/settings/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/notifications"              element={<NotificationsPageFull />} />
          <Route path="/settings/history"      element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
          <Route path="/settings/account"      element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />

          <Route path="*"                      element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </MemoryRouter>
  )
}
