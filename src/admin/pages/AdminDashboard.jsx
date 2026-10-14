import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { inventoryService } from '../../services/inventoryService'
import { useAuth } from '../../context/AuthContext'
import {
  Car,
  CheckCircle,
  CurrencyInr,
  PlusCircle,
  ArrowRight,
  PencilSimple,
  ArrowSquareOut,
  ShieldCheck,
  Tag,
  ArrowClockwise,
  Clock
} from '@phosphor-icons/react'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const { isDemoMode } = useAuth()

  useEffect(() => {
    const unsubscribe = inventoryService.subscribe((list) => {
      setVehicles(list || [])
      setLoading(false)
    })
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  // KPI calculations
  const totalVehicles = vehicles.length
  const availableVehicles = vehicles.filter(v => (v.status || 'available') === 'available').length
  const soldVehicles = vehicles.filter(v => v.status === 'sold').length

  // Calculate total valuation
  const totalValuationLakhs = vehicles.reduce((sum, v) => {
    const val = typeof v.priceNumber === 'number' ? v.priceNumber : parseFloat(v.price?.replace(/[^0-9.]/g, '') || 0)
    return sum + (isNaN(val) ? 0 : val)
  }, 0)

  const formattedValuation = totalValuationLakhs >= 100
    ? `₹ ${(totalValuationLakhs / 100).toFixed(2)} Cr`
    : `₹ ${totalValuationLakhs.toFixed(2)} L`

  // Category breakdown
  const categoryCounts = {
    suv: vehicles.filter(v => v.category === 'suv').length,
    sedan: vehicles.filter(v => v.category === 'sedan').length,
    luxury: vehicles.filter(v => v.category === 'luxury').length,
  }

  // Quick toggle status
  const handleToggleStatus = async (id) => {
    try {
      await inventoryService.toggleVehicleStatus(id)
    } catch (err) {
      console.error('Failed to toggle vehicle status:', err)
    }
  }

  // Reset to demo data
  const handleResetDemo = () => {
    if (window.confirm('Reset local inventory to the default certified Zara Cars fleet?')) {
      inventoryService.resetDemoData()
    }
  }

  // Recently updated / added (first 5)
  const recentVehicles = [...vehicles].slice(0, 5)

  return (
    <div className="admin-dash">
      {/* Header Banner */}
      <div className="admin-dash__header">
        <div className="admin-dash__title-group">
          <h1>Dealership Command Center</h1>
          <p className="admin-dash__subtitle">
            Sri Balaji Showroom inventory operations, certification telemetry, and active fleet status
          </p>
        </div>

        <div className="admin-dash__actions">
          {isDemoMode && (
            <button
              onClick={handleResetDemo}
              className="btn-secondary"
              title="Reset inventory to initial demo fleet"
              type="button"
            >
              <ArrowClockwise size={15} />
              <span>Reset Demo Fleet</span>
            </button>
          )}

          <Link to="/admin/cars/new" className="admin-topbar__cta">
            <PlusCircle size={16} weight="bold" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="admin-kpi-grid">
        {/* Total Fleet */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Total Fleet</span>
            <div className="admin-kpi-card__icon">
              <Car size={18} weight="duotone" />
            </div>
          </div>
          <div className="admin-kpi-card__value">{totalVehicles}</div>
          <div className="admin-kpi-card__footer">
            <span>Certified Showroom Units</span>
          </div>
        </div>

        {/* Available for Sale */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Available Units</span>
            <div className="admin-kpi-card__icon" style={{ color: '#10b981' }}>
              <CheckCircle size={18} weight="duotone" />
            </div>
          </div>
          <div className="admin-kpi-card__value" style={{ color: '#34d399' }}>
            {availableVehicles}
          </div>
          <div className="admin-kpi-card__footer">
            <span>Ready for Immediate Handover</span>
          </div>
        </div>

        {/* Sold Units */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Delivered / Sold</span>
            <div className="admin-kpi-card__icon" style={{ color: '#f87171' }}>
              <Tag size={18} weight="duotone" />
            </div>
          </div>
          <div className="admin-kpi-card__value" style={{ color: '#f87171' }}>
            {soldVehicles}
          </div>
          <div className="admin-kpi-card__footer">
            <span>Customer Handover Completed</span>
          </div>
        </div>

        {/* Total Showroom Valuation */}
        <div className="admin-kpi-card">
          <div className="admin-kpi-card__top">
            <span className="admin-kpi-card__label">Inventory Valuation</span>
            <div className="admin-kpi-card__icon">
              <CurrencyInr size={18} weight="duotone" />
            </div>
          </div>
          <div className="admin-kpi-card__value" style={{ color: '#c8a96a' }}>
            {formattedValuation}
          </div>
          <div className="admin-kpi-card__footer">
            <span>Cumulative Certified Fleet Value</span>
          </div>
        </div>
      </div>

      {/* Two-Column Detail Split */}
      <div className="admin-dash__split">
        {/* Recent Inventory Table */}
        <div className="admin-panel">
          <div className="admin-panel__header">
            <h2 className="admin-panel__title">
              <Clock size={18} color="#c8a96a" />
              <span>Recently Updated Inventory</span>
            </h2>
            <Link to="/admin/cars" className="admin-panel__link">
              <span>View All Fleet</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentVehicles.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No vehicles in inventory yet. Click "Add Vehicle" to create your first listing.
                    </td>
                  </tr>
                ) : (
                  recentVehicles.map((car) => {
                    const isSold = car.status === 'sold'
                    return (
                      <tr key={car.id}>
                        <td>
                          <div className="car-cell-info">
                            <img
                              src={car.image}
                              alt={car.name}
                              className="car-cell-thumb"
                              loading="lazy"
                            />
                            <div>
                              <div className="car-cell-title">{car.name}</div>
                              <div className="car-cell-sub">
                                {car.year} · {car.km} · {car.fuel?.split('·')[0]}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={{ fontWeight: 600, color: '#f1f5f9' }}>
                          {car.price}
                        </td>

                        <td>
                          <span style={{ textTransform: 'capitalize', color: '#94a3b8' }}>
                            {car.category || 'SUV'}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(car.id)}
                            className={`status-pill ${isSold ? 'status-pill--sold' : 'status-pill--available'}`}
                            title="Click to toggle status between Available and Sold"
                            style={{ border: 'none', cursor: 'pointer' }}
                          >
                            <span>{isSold ? 'Sold' : 'Available'}</span>
                          </button>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                            <Link
                              to={`/admin/cars/${car.id}/edit`}
                              className="btn-secondary"
                              style={{ padding: '0.35rem 0.65rem' }}
                              title="Edit vehicle details"
                            >
                              <PencilSimple size={14} />
                              <span>Edit</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Category Breakdown & Showroom Badge */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Category Distribution */}
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Fleet by Category</h2>
            </div>
            <div className="cat-breakdown">
              <div className="cat-item">
                <div className="cat-item__top">
                  <span className="cat-item__name">SUVs &amp; 4x4</span>
                  <span className="cat-item__count">
                    {categoryCounts.suv} ({totalVehicles ? Math.round((categoryCounts.suv / totalVehicles) * 100) : 0}%)
                  </span>
                </div>
                <div className="cat-bar-bg">
                  <div
                    className="cat-bar-fill"
                    style={{ width: `${totalVehicles ? (categoryCounts.suv / totalVehicles) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="cat-item">
                <div className="cat-item__top">
                  <span className="cat-item__name">Executive Sedans</span>
                  <span className="cat-item__count">
                    {categoryCounts.sedan} ({totalVehicles ? Math.round((categoryCounts.sedan / totalVehicles) * 100) : 0}%)
                  </span>
                </div>
                <div className="cat-bar-bg">
                  <div
                    className="cat-bar-fill"
                    style={{ width: `${totalVehicles ? (categoryCounts.sedan / totalVehicles) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="cat-item">
                <div className="cat-item__top">
                  <span className="cat-item__name">Luxury Pre-Owned</span>
                  <span className="cat-item__count">
                    {categoryCounts.luxury} ({totalVehicles ? Math.round((categoryCounts.luxury / totalVehicles) * 100) : 0}%)
                  </span>
                </div>
                <div className="cat-bar-bg">
                  <div
                    className="cat-bar-fill"
                    style={{ width: `${totalVehicles ? (categoryCounts.luxury / totalVehicles) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dealership Certified Seal */}
          <div className="dealership-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <ShieldCheck size={20} color="#c8a96a" weight="fill" />
              <div className="dealership-banner__title">Sri Balaji Showroom Certification</div>
            </div>
            <p className="dealership-banner__address">
              No. 1, Sri Balaji Complex, Kanchipuram to Chengalpattu Main Road.
              Every vehicle in this dashboard syncs directly to the customer-facing showroom with verified 140-point certification checks.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
