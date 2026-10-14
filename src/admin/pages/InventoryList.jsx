import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { inventoryService } from '../../services/inventoryService'
import CarDetailsModal from '../../components/CarDetailsModal'
import {
  Car,
  MagnifyingGlass,
  PlusCircle,
  PencilSimple,
  Trash,
  Eye,
  CheckCircle,
  Tag,
  ArrowsDownUp,
  XCircle,
  Warning
} from '@phosphor-icons/react'
import './InventoryList.css'

export default function InventoryList() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  // Modals
  const [carToDelete, setCarToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewCar, setPreviewCar] = useState(null)

  useEffect(() => {
    const unsubscribe = inventoryService.subscribe((list) => {
      setVehicles(list || [])
      setLoading(false)
    })
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [])

  // Filter & Search logic
  const filteredVehicles = vehicles
    .filter((car) => {
      // Search match
      const q = search.toLowerCase().trim()
      const matchesSearch =
        !q ||
        car.name?.toLowerCase().includes(q) ||
        car.brand?.toLowerCase().includes(q) ||
        car.model?.toLowerCase().includes(q) ||
        car.rto?.toLowerCase().includes(q) ||
        car.fuel?.toLowerCase().includes(q)

      // Status match
      const carStatus = car.status || 'available'
      const matchesStatus = statusFilter === 'all' || carStatus === statusFilter

      // Category match
      const matchesCategory = categoryFilter === 'all' || car.category === categoryFilter

      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc') {
        const valA = typeof a.priceNumber === 'number' ? a.priceNumber : parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0)
        const valB = typeof b.priceNumber === 'number' ? b.priceNumber : parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0)
        return valA - valB
      }
      if (sortBy === 'price-desc') {
        const valA = typeof a.priceNumber === 'number' ? a.priceNumber : parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0)
        const valB = typeof b.priceNumber === 'number' ? b.priceNumber : parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0)
        return valB - valA
      }
      if (sortBy === 'year-desc') {
        return (b.year || 0) - (a.year || 0)
      }
      if (sortBy === 'km-asc') {
        const kmA = parseInt(a.km?.replace(/[^0-9]/g, '') || 0)
        const kmB = parseInt(b.km?.replace(/[^0-9]/g, '') || 0)
        return kmA - kmB
      }
      // 'newest' default
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    })

  // Status toggle handler
  const handleToggleStatus = async (carId) => {
    try {
      await inventoryService.toggleVehicleStatus(carId)
    } catch (err) {
      console.error('Error toggling vehicle status:', err)
    }
  }

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!carToDelete) return
    setIsDeleting(true)
    try {
      await inventoryService.deleteVehicle(carToDelete.id)
      setCarToDelete(null)
    } catch (err) {
      alert('Failed to delete vehicle. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <div>
          <h1 className="inventory-header__title">Vehicle Inventory Management</h1>
          <p className="inventory-header__sub">
            Manage your showroom catalog, specifications, certified statuses, and customer listings
          </p>
        </div>

        <Link to="/admin/cars/new" className="admin-topbar__cta">
          <PlusCircle size={16} weight="bold" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="inventory-controls">
        <div className="inventory-controls__row">
          {/* Search Input */}
          <div className="inventory-search-wrap">
            <MagnifyingGlass size={16} className="inventory-search-icon" />
            <input
              type="text"
              placeholder="Search by car name, brand, model, RTO, or fuel..."
              className="inventory-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowsDownUp size={16} color="#8b92a4" />
            <select
              className="inventory-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Sort: Recently Added</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="year-desc">Year: Newest First</option>
              <option value="km-asc">Mileage: Low to High</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="inventory-controls__row">
          {/* Status Filter */}
          <div className="inventory-filters-group">
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
              Status:
            </span>
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({vehicles.length})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'available' ? 'active' : ''}`}
              onClick={() => setStatusFilter('available')}
            >
              Available ({vehicles.filter(v => (v.status || 'available') === 'available').length})
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === 'sold' ? 'active' : ''}`}
              onClick={() => setStatusFilter('sold')}
            >
              Sold ({vehicles.filter(v => v.status === 'sold').length})
            </button>
          </div>

          {/* Category Filter */}
          <div className="inventory-filters-group">
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 600 }}>
              Category:
            </span>
            <button
              type="button"
              className={`filter-pill-btn ${categoryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('all')}
            >
              All Types
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${categoryFilter === 'suv' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('suv')}
            >
              SUVs &amp; 4x4
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${categoryFilter === 'sedan' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('sedan')}
            >
              Sedans
            </button>
            <button
              type="button"
              className={`filter-pill-btn ${categoryFilter === 'luxury' ? 'active' : ''}`}
              onClick={() => setCategoryFilter('luxury')}
            >
              Luxury
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Price &amp; Valuation</th>
                <th>Specifications</th>
                <th>Status</th>
                <th>Category</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#8b92a4' }}>
                    <Car size={36} color="#475569" style={{ margin: '0 auto 0.75rem' }} />
                    <div style={{ fontSize: '1rem', color: '#f1f5f9', fontWeight: 500, marginBottom: '0.35rem' }}>
                      No vehicles found
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>
                      {search || statusFilter !== 'all' || categoryFilter !== 'all'
                        ? 'Try adjusting your search criteria or resetting the active filters.'
                        : 'Your showroom inventory is currently empty. Add your first vehicle to get started.'}
                    </p>
                    {(search || statusFilter !== 'all' || categoryFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearch('')
                          setStatusFilter('all')
                          setCategoryFilter('all')
                        }}
                        className="btn-secondary"
                        style={{ marginTop: '1rem' }}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((car) => {
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
                              {car.badge || '140-PT CERTIFIED'} · {car.rto || 'TN-21'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                          {car.price}
                        </div>
                        {car.savings && (
                          <div style={{ fontSize: '0.72rem', color: '#c8a96a' }}>
                            {car.savings}
                          </div>
                        )}
                      </td>

                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                          {car.year} · {car.km}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#717684' }}>
                          {car.fuel?.split('·')[0]}
                        </div>
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

                      <td>
                        <span style={{ textTransform: 'capitalize', color: '#94a3b8', fontSize: '0.8rem' }}>
                          {car.category || 'SUV'}
                        </span>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                          {/* Live Public Preview Button */}
                          <button
                            type="button"
                            onClick={() => setPreviewCar(car)}
                            className="action-btn action-btn--preview"
                            title="Preview how this vehicle appears to customers"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit Button */}
                          <Link
                            to={`/admin/cars/${car.id}/edit`}
                            className="action-btn"
                            title="Edit vehicle details"
                          >
                            <PencilSimple size={16} />
                          </Link>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => setCarToDelete(car)}
                            className="action-btn action-btn--delete"
                            title="Delete vehicle from inventory"
                          >
                            <Trash size={16} />
                          </button>
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

      {/* Delete Confirmation Modal */}
      {carToDelete && (
        <div className="admin-modal-backdrop" onClick={() => setCarToDelete(null)}>
          <div className="admin-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '0.5rem' }}>
              <Warning size={24} weight="fill" />
              <h2 className="admin-confirm-title" style={{ color: '#ef4444', margin: 0 }}>
                Confirm Vehicle Deletion
              </h2>
            </div>

            <p className="admin-confirm-desc">
              Are you sure you want to permanently delete this vehicle from your dealership catalog?
              This will remove the car from the public showroom fleet.
            </p>

            <div className="admin-confirm-car-preview">
              <img
                src={carToDelete.image}
                alt={carToDelete.name}
                className="admin-confirm-car-img"
              />
              <div>
                <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>
                  {carToDelete.name}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  {carToDelete.year} · {carToDelete.price} · {carToDelete.rto || 'TN-21'}
                </div>
              </div>
            </div>

            <div className="admin-confirm-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCarToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Vehicle'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Customer Modal Preview */}
      {previewCar && (
        <CarDetailsModal
          car={previewCar}
          onClose={() => setPreviewCar(null)}
        />
      )}
    </div>
  )
}
