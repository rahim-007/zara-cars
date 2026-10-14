import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { inventoryService } from '../../services/inventoryService'
import CarDetailsModal from '../../components/CarDetailsModal'
import {
  Car,
  ArrowLeft,
  FloppyDisk,
  Eye,
  Plus,
  Trash,
  X,
  UploadSimple,
  CheckCircle,
  CurrencyInr,
  ShieldCheck,
  Sparkle,
  WarningCircle
} from '@phosphor-icons/react'
import './CarForm.css'

export default function CarForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [previewing, setPreviewing] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Highlights input buffer
  const [highlightInput, setHighlightInput] = useState('')
  const [galleryUrlInput, setGalleryUrlInput] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    category: 'suv',
    status: 'available',
    price: '₹ 15.00 L',
    priceNumber: 15.0,
    originalPrice: '₹ 20.00 L (New)',
    savings: 'Save ₹ 5.00 Lakhs',
    budget: 'under-15',
    budgetLabel: 'Under ₹15 Lakhs',
    tag: 'Certified Pre-Owned',
    badge: '140-PT CERTIFIED',
    km: '25,000 KM',
    fuel: 'Petrol · Automatic',
    owner: '1st Owner',
    rto: 'TN-21 (Kanchipuram)',
    insurance: 'Comprehensive Active till 2026',
    color: 'Metallic Black',
    warranty: '1 Year Warranty Included',
    desc: 'Exemplary certified automobile inspected across 140 mechanical and electronic checkpoints. Single owner driven with complete dealer service records.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80&fit=crop',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80&fit=crop'
    ],
    highlights: [
      'Single Owner Driven',
      'Full Authorized Service History',
      'Touchscreen Infotainment with Apple CarPlay',
      'Zero Accident Structural Certification',
      'Free RTO Name Transfer'
    ],
    specs: [
      { label: 'Odometer', value: '25,000 KM' },
      { label: 'Transmission', value: 'Automatic' },
      { label: 'Fuel Type', value: 'Petrol' },
      { label: 'Ownership', value: '1st Owner' },
      { label: 'Registration', value: 'TN-21 Kanchipuram' },
      { label: 'Showroom Handover', value: 'Sri Balaji Complex' }
    ],
    checks: [
      { category: 'Engine & Turbo', status: 'Passed', detail: 'OBD-II Scan 0 Errors, Compression Normal' },
      { category: 'Chassis & Frame', status: 'Certified', detail: '100% Non-Accidental OEM Spot Welds Intact' },
      { category: 'Flood Free Integrity', status: 'Verified', detail: 'Zero Waterline Rust or Underbody Corrosion' },
      { category: 'Cabin AC & Electricals', status: 'Tested', detail: 'Sub-Zero Chiller AC, 100% Functional' },
      { category: 'Legal Clearance', status: 'Cleared', detail: 'Original RC, Bank NOC in hand, Zero Challans' }
    ]
  })

  // Load existing vehicle if editing
  useEffect(() => {
    if (!isEdit) return
    async function loadCar() {
      try {
        setLoading(true)
        const car = await inventoryService.getVehicleById(id)
        if (car) {
          setFormData((prev) => ({
            ...prev,
            ...car,
            highlights: car.highlights || prev.highlights,
            gallery: car.gallery || [car.image],
            specs: car.specs || prev.specs,
            checks: car.checks || prev.checks,
          }))
        } else {
          setError('Vehicle not found. It may have been deleted.')
        }
      } catch (err) {
        setError('Error loading vehicle data.')
      } finally {
        setLoading(false)
      }
    }
    loadCar()
  }, [id, isEdit])

  // Field change handler
  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }

      // Auto-compute budget category if numeric price changes
      if (field === 'priceNumber') {
        const num = parseFloat(value) || 0
        if (num <= 15) {
          updated.budget = 'under-15'
          updated.budgetLabel = 'Under ₹15 Lakhs'
        } else if (num <= 35) {
          updated.budget = '15-to-35'
          updated.budgetLabel = '₹15L – ₹35 Lakhs'
        } else {
          updated.budget = 'above-35'
          updated.budgetLabel = 'Above ₹35 Lakhs'
        }
      }

      return updated
    })
  }

  // Add highlight tag
  const handleAddHighlight = (e) => {
    if (e) e.preventDefault()
    const trimmed = highlightInput.trim()
    if (!trimmed) return
    if (formData.highlights.includes(trimmed)) return
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, trimmed]
    }))
    setHighlightInput('')
  }

  // Remove highlight tag
  const handleRemoveHighlight = (idx) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== idx)
    }))
  }

  // Add image URL to gallery
  const handleAddGalleryUrl = (e) => {
    if (e) e.preventDefault()
    const trimmed = galleryUrlInput.trim()
    if (!trimmed) return
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, trimmed]
    }))
    setGalleryUrlInput('')
  }

  // Remove image from gallery
  const handleRemoveGalleryImage = (idx) => {
    setFormData((prev) => {
      const newGallery = prev.gallery.filter((_, i) => i !== idx)
      return {
        ...prev,
        gallery: newGallery,
        image: prev.image === prev.gallery[idx] && newGallery.length > 0 ? newGallery[0] : prev.image
      }
    })
  }

  // Set image as primary
  const handleSetPrimaryImage = (url) => {
    setFormData((prev) => ({ ...prev, image: url }))
  }

  // File upload handler
  const handleFileUpload = async (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const uploadedUrl = await inventoryService.uploadImage(file)
        if (uploadedUrl) {
          setFormData((prev) => {
            const hasNoPrimary = !prev.image || prev.image.includes('placeholder')
            return {
              ...prev,
              image: hasNoPrimary ? uploadedUrl : prev.image,
              gallery: [...prev.gallery, uploadedUrl]
            }
          })
        }
      }
    } catch (err) {
      alert('Error uploading image. Please check file format.')
    }
  }

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    // Form validations
    if (!formData.name.trim()) {
      setError('Please provide a valid Car Name.')
      setSaving(false)
      return
    }

    try {
      // Ensure specs array has up-to-date fields
      const updatedSpecs = [
        { label: 'Odometer', value: formData.km },
        { label: 'Fuel & Transmission', value: formData.fuel },
        { label: 'Ownership', value: formData.owner },
        { label: 'RTO Registration', value: formData.rto },
        { label: 'Insurance', value: formData.insurance },
        { label: 'Exterior Color', value: formData.color },
        { label: 'Warranty', value: formData.warranty },
        { label: 'Dealership', value: 'No. 1, Sri Balaji Complex' }
      ]

      const submissionPayload = {
        ...formData,
        specs: updatedSpecs,
      }

      if (isEdit) {
        await inventoryService.updateVehicle(id, submissionPayload)
        setSuccess('Vehicle updated successfully!')
      } else {
        await inventoryService.addVehicle(submissionPayload)
        setSuccess('Vehicle added successfully to inventory!')
      }

      setTimeout(() => {
        navigate('/admin/cars')
      }, 700)
    } catch (err) {
      setError(err.message || 'Error saving vehicle to database.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
        <p>Loading vehicle data...</p>
      </div>
    )
  }

  return (
    <div className="car-form-page">
      {/* Header */}
      <div className="car-form-header">
        <div className="car-form-header__left">
          <Link to="/admin/cars" className="car-form-back-btn" title="Back to Inventory">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="car-form-title">{isEdit ? 'Edit Vehicle Listing' : 'Add New Certified Vehicle'}</h1>
            <p className="car-form-subtitle">
              Configure showroom pricing, technical specifications, gallery photos, and 140-point inspection
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setPreviewing(true)}
            className="btn-secondary"
          >
            <Eye size={16} />
            <span>Live Customer Preview</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="admin-login-error">
          <WarningCircle size={20} weight="fill" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          padding: '0.85rem 1rem',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem'
        }}>
          <CheckCircle size={20} weight="fill" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        
        {/* Section 1: Core Identity & Availability */}
        <div className="form-section-card">
          <h2 className="form-section-title">
            <Car size={18} color="#c8a96a" weight="duotone" />
            <span>1. Core Vehicle Identity &amp; Availability</span>
          </h2>

          <div className="form-field">
            <label className="form-label">
              Full Listing Name <span className="req">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. BMW 3 Series 330i M-Sport"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label">Brand</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. BMW, Hyundai, Mahindra"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Model &amp; Trim</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 330i M-Sport"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Manufacturing Year <span className="req">*</span></label>
              <input
                type="number"
                className="form-input"
                min="2010"
                max={new Date().getFullYear() + 1}
                value={formData.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value) || 2022)}
                required
              />
            </div>
          </div>

          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <option value="suv">SUV &amp; 4x4 Off-Road</option>
                <option value="sedan">Executive Sedan</option>
                <option value="luxury">Luxury Pre-Owned</option>
              </select>
            </div>

            <div className="form-field">
              <label className="form-label">Showroom Availability Status</label>
              <div className="status-radio-group">
                <label className={`status-radio-option ${formData.status === 'available' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'available'}
                    onChange={() => handleChange('status', 'available')}
                    style={{ accentColor: '#10b981' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>Available for Sale</span>
                </label>

                <label className={`status-radio-option ${formData.status === 'sold' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === 'sold'}
                    onChange={() => handleChange('status', 'sold')}
                    style={{ accentColor: '#ef4444' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>Mark as Sold</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Pricing, Budget & Dealership Valuation */}
        <div className="form-section-card">
          <h2 className="form-section-title">
            <CurrencyInr size={18} color="#c8a96a" weight="duotone" />
            <span>2. Pricing &amp; Budget Classification</span>
          </h2>

          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label">
                Showroom Display Price <span className="req">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ₹ 38.50 L"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">
                Numeric Price in Lakhs (for sorting) <span className="req">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="38.50"
                value={formData.priceNumber}
                onChange={(e) => handleChange('priceNumber', parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Budget Tier</label>
              <select
                className="form-select"
                value={formData.budget}
                onChange={(e) => {
                  const b = e.target.value
                  handleChange('budget', b)
                  if (b === 'under-15') handleChange('budgetLabel', 'Under ₹15 Lakhs')
                  if (b === '15-to-35') handleChange('budgetLabel', '₹15L – ₹35 Lakhs')
                  if (b === 'above-35') handleChange('budgetLabel', 'Above ₹35 Lakhs')
                }}
              >
                <option value="under-15">Under ₹15 Lakhs</option>
                <option value="15-to-35">₹15L – ₹35 Lakhs</option>
                <option value="above-35">Above ₹35 Lakhs</option>
              </select>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label">Original Price When New</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. ₹ 62.00 L (New)"
                value={formData.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Savings Value</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Save ₹ 23.50 Lakhs"
                value={formData.savings}
                onChange={(e) => handleChange('savings', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Certification Badge</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 140-PT CERTIFIED"
                value={formData.badge}
                onChange={(e) => handleChange('badge', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Technical Specifications & RTO */}
        <div className="form-section-card">
          <h2 className="form-section-title">
            <ShieldCheck size={18} color="#c8a96a" weight="duotone" />
            <span>3. Technical Specifications &amp; Registration</span>
          </h2>

          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label">Odometer / Mileage <span className="req">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 34,200 KM"
                value={formData.km}
                onChange={(e) => handleChange('km', e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Fuel Type &amp; Gearbox <span className="req">*</span></label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Petrol · 8-Speed Steptronic"
                value={formData.fuel}
                onChange={(e) => handleChange('fuel', e.target.value)}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Ownership History</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 1st Owner / Single Owner"
                value={formData.owner}
                onChange={(e) => handleChange('owner', e.target.value)}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-field">
              <label className="form-label">RTO Registration</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. TN-21 (Kanchipuram)"
                value={formData.rto}
                onChange={(e) => handleChange('rto', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Insurance Coverage</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Comprehensive till late 2026"
                value={formData.insurance}
                onChange={(e) => handleChange('insurance', e.target.value)}
              />
            </div>

            <div className="form-field">
              <label className="form-label">Exterior Color</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Portimao Blue Metallic"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section 4: Imagery & Gallery */}
        <div className="form-section-card">
          <h2 className="form-section-title">
            <UploadSimple size={18} color="#c8a96a" weight="duotone" />
            <span>4. Vehicle Imagery &amp; Multi-Photo Gallery</span>
          </h2>

          <div className="form-field">
            <label className="form-label">Primary Cover Image URL</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
            />
          </div>

          {/* Upload Box */}
          <div className="form-field">
            <label className="form-label">Upload Images (Device / Storage)</label>
            <label className="image-upload-box">
              <UploadSimple size={28} color="#c8a96a" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 500 }}>
                Click to upload vehicle photos
              </div>
              <p style={{ fontSize: '0.75rem', color: '#717684', marginTop: '0.25rem' }}>
                Supports JPG, PNG, WEBP. If Cloud Storage is connected, uploaded to Firebase; otherwise saved to local database.
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Add URL to Gallery */}
          <div className="form-field">
            <label className="form-label">Or Add Gallery Image URL</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="url"
                className="form-input"
                placeholder="Paste direct image link..."
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
              />
              <button
                type="button"
                onClick={handleAddGalleryUrl}
                className="btn-secondary"
                style={{ flexShrink: 0 }}
              >
                <Plus size={16} />
                <span>Add Photo</span>
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails List */}
          {formData.gallery.length > 0 && (
            <div>
              <span style={{ fontSize: '0.75rem', color: '#8b92a4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Gallery Photos ({formData.gallery.length}) · Click any to set as Primary
              </span>
              <div className="gallery-grid">
                {formData.gallery.map((url, idx) => {
                  const isPrimary = formData.image === url
                  return (
                    <div
                      key={idx}
                      className="gallery-thumb-item"
                      onClick={() => handleSetPrimaryImage(url)}
                      style={{ cursor: 'pointer', border: isPrimary ? '2px solid #c8a96a' : '1px solid rgba(255,255,255,0.1)' }}
                      title="Click to set as primary cover image"
                    >
                      <img src={url} alt={`Gallery ${idx + 1}`} />
                      {isPrimary && <span className="gallery-primary-badge">PRIMARY</span>}
                      <button
                        type="button"
                        className="gallery-thumb-del"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveGalleryImage(idx)
                        }}
                        title="Remove image"
                      >
                        <Trash size={12} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Description & Highlights */}
        <div className="form-section-card">
          <h2 className="form-section-title">
            <Sparkle size={18} color="#c8a96a" weight="duotone" />
            <span>5. Description &amp; Key Equipment Highlights</span>
          </h2>

          <div className="form-field">
            <label className="form-label">Detailed Vehicle Description</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={formData.desc}
              onChange={(e) => handleChange('desc', e.target.value)}
              placeholder="Highlight the condition, service records, ownership, and special options..."
            />
          </div>

          {/* Highlights Tag Chips */}
          <div className="form-field">
            <label className="form-label">Key Equipment Highlights</label>
            <div className="tags-input-container">
              {formData.highlights.map((tag, idx) => (
                <span key={idx} className="tag-chip">
                  <span>{tag}</span>
                  <button type="button" onClick={() => handleRemoveHighlight(idx)}>
                    <X size={12} />
                  </button>
                </span>
              ))}

              <input
                type="text"
                className="tag-text-input"
                placeholder="Type feature (e.g. Panoramic Sunroof) and press Enter..."
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddHighlight()
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="car-form-footer">
          <Link to="/admin/cars" className="btn-secondary" style={{ padding: '0.75rem 1.25rem' }}>
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-btn-primary"
            disabled={saving}
            style={{ padding: '0.75rem 1.75rem' }}
          >
            <FloppyDisk size={18} weight="bold" />
            <span>{saving ? 'Saving Vehicle...' : isEdit ? 'Update Vehicle' : 'Publish to Showroom'}</span>
          </button>
        </div>
      </form>

      {/* Customer Live Modal Preview */}
      {previewing && (
        <CarDetailsModal
          car={formData}
          onClose={() => setPreviewing(false)}
        />
      )}
    </div>
  )
}
