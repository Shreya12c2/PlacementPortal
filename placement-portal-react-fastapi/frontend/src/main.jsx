import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import StudentPortal from './pages/StudentPortal'

import StudentDashboardLayout from './pages/StudentDashboardLayout'
import StudentApplications from './pages/StudentApplications'
import StudentDrives from './pages/StudentDrives'
import StudentProfile from './pages/StudentProfile'
import StudentInterviewPrep from './pages/StudentInterviewPrep'

// Admin pages (ensure these files exist under src/pages/admin/)
import AdminLayout from './pages/admin/AdminLayout'
import DriveManagement from './pages/admin/DriveManagement'
import ReportsDashboard from './pages/admin/ReportsDashboard'
import Announcements from './pages/admin/Announcements'

import './index.css'

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/" replace />
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />

        {/* Generic dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />

        {/* Old single-page student portal (kept for backward compat) */}
        <Route
          path="/student"
          element={
            <RequireAuth>
              <StudentPortal />
            </RequireAuth>
          }
        />

        {/* Student dashboard with collapsible sidebar and nested routes */}
        <Route
          path="/student/*"
          element={
            <RequireAuth>
              <StudentDashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="applications" replace />} />
          <Route path="applications" element={<StudentApplications />} />
          <Route path="drives" element={<StudentDrives />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="interview-prep" element={<StudentInterviewPrep />} />
        </Route>

        {/* Admin portal (protected). Make sure admin files exist under src/pages/admin/ */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="drives" replace />} />
          <Route path="drives" element={<DriveManagement />} />
          <Route path="reports" element={<ReportsDashboard />} />
          <Route path="announcements" element={<Announcements />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
