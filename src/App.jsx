import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './admin/components/ProtectedRoute'

// Public Showroom Page
import PublicPage from './pages/PublicPage'

// Admin Suite Pages & Layout
import AdminLayout from './admin/AdminLayout'
import AdminLogin from './admin/pages/AdminLogin'
import AdminDashboard from './admin/pages/AdminDashboard'
import InventoryList from './admin/pages/InventoryList'
import CarForm from './admin/pages/CarForm'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Customer Showroom */}
          <Route path="/" element={<PublicPage />} />

          {/* Dealership Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Dealership Management Suite */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            {/* Overview / KPI Dashboard */}
            <Route index element={<AdminDashboard />} />

            {/* Inventory Fleet Management */}
            <Route path="cars" element={<InventoryList />} />

            {/* Add New Vehicle Listing */}
            <Route path="cars/new" element={<CarForm />} />

            {/* Edit Existing Vehicle Listing */}
            <Route path="cars/:id/edit" element={<CarForm />} />
          </Route>

          {/* Fallback to Public Showroom */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
