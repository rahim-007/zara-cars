import { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { inventoryService } from '../services/inventoryService'
import {
  Gauge,
  Car,
  PlusCircle,
  SignOut,
  ArrowSquareOut,
  List,
  X,
  ShieldCheck,
  Database,
  CaretRight
} from '@phosphor-icons/react'
import './AdminLayout.css'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [vehicleCount, setVehicleCount] = useState(0)
  const { user, logout, isDemoMode } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    // Keep sidebar vehicle counter synced
    const unsubscribe = inventoryService.subscribe((vehicles) => {
      setVehicleCount(vehicles.length)
    })
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  // Generate dynamic breadcrumb
  const getBreadcrumb = () => {
    if (location.pathname === '/admin') return 'Overview'
    if (location.pathname === '/admin/cars') return 'Vehicle Inventory'
    if (location.pathname === '/admin/cars/new') return 'Add New Vehicle'
    if (location.pathname.includes('/edit')) return 'Edit Vehicle'
    return 'Dashboard'
  }

  return (
    <div className="admin-layout">
      {/* Mobile Backdrop */}
      <div
        className={`admin-sidebar__backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link to="/admin" className="admin-sidebar__brand">
            <div className="admin-sidebar__logo-wrap">
              <Car size={22} weight="bold" />
            </div>
            <div>
              <h2 className="admin-sidebar__title">ZARA CARS</h2>
              <span className="admin-sidebar__tagline">Dealership Admin</span>
            </div>
          </Link>
        </div>

        {/* Database & Environment Status Badge */}
        <div className="admin-sidebar__status">
          <div className="admin-sidebar__status-info">
            <span className="admin-sidebar__status-label">Database Engine</span>
            <span className="admin-sidebar__status-val">
              <span className={`status-dot ${isDemoMode ? 'status-dot--demo' : 'status-dot--live'}`} />
              {isDemoMode ? 'Demo Mode (Local)' : 'Cloud Firestore'}
            </span>
          </div>
          <Database size={18} color="#c8a96a" weight="duotone" />
        </div>

        {/* Navigation Menu */}
        <nav className="admin-sidebar__nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Gauge size={19} weight="duotone" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/cars"
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <Car size={19} weight="duotone" />
            <span>Car Inventory</span>
            {vehicleCount > 0 && (
              <span className="admin-nav-item__badge">{vehicleCount}</span>
            )}
          </NavLink>

          <NavLink
            to="/admin/cars/new"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
          >
            <PlusCircle size={19} weight="duotone" />
            <span>Add Vehicle</span>
          </NavLink>

          <div style={{ margin: '1rem 0 0.5rem', padding: '0 0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }} />

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="admin-nav-item"
            title="Open customer-facing website in new tab"
          >
            <ArrowSquareOut size={19} weight="duotone" />
            <span>View Public Site</span>
          </a>
        </nav>

        {/* User Info & Logout */}
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__avatar">
              {user?.email ? user.email.charAt(0).toUpperCase() : 'Z'}
            </div>
            <div className="admin-sidebar__user-details">
              <span className="admin-sidebar__username" title={user?.email || 'Administrator'}>
                {user?.email || 'admin@zaracars.com'}
              </span>
              <span className="admin-sidebar__userrole">
                {isDemoMode ? 'Demo Dealership' : 'Certified Owner'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="admin-sidebar__logout-btn"
            title="Sign Out of Dealership Portal"
            type="button"
          >
            <SignOut size={17} weight="bold" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Top Header Bar */}
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="admin-topbar__menu-toggle"
              aria-label="Toggle Navigation"
              type="button"
            >
              {sidebarOpen ? <X size={22} /> : <List size={22} />}
            </button>

            <div className="admin-topbar__breadcrumb">
              <span>Admin</span>
              <CaretRight size={13} color="#475569" />
              <span className="admin-topbar__breadcrumb-active">{getBreadcrumb()}</span>
            </div>
          </div>

          <div className="admin-topbar__right">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="admin-topbar__public-link"
            >
              <ArrowSquareOut size={15} />
              <span>Preview Showroom</span>
            </a>

            <Link to="/admin/cars/new" className="admin-topbar__cta">
              <PlusCircle size={16} weight="bold" />
              <span>Add Vehicle</span>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
