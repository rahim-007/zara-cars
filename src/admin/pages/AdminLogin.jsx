import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LockSimple,
  EnvelopeSimple,
  ShieldCheck,
  WarningCircle,
  ArrowLeft,
  Sparkle,
  ArrowRight
} from '@phosphor-icons/react'
import './AdminLogin.css'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const { login, demoLogin, isDemoMode } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destination = location.state?.from?.pathname || '/admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemoSignIn = async () => {
    setError(null)
    setSubmitting(true)
    try {
      await demoLogin()
      navigate(destination, { replace: true })
    } catch (err) {
      setError(err.message || 'Demo access failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-badge">
            <ShieldCheck size={14} weight="fill" />
            <span>Authorized Personnel Only</span>
          </div>
          <h1 className="admin-login-title">Zara Cars Portal</h1>
          <p className="admin-login-subtitle">
            Sign in to manage showroom inventory, certifications, and vehicle listings
          </p>
        </div>

        {error && (
          <div className="admin-login-error" style={{ marginBottom: '1.25rem' }}>
            <WarningCircle size={18} weight="fill" style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-email">
              Admin Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              className="admin-form-input"
              placeholder="owner@zaracars.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label" htmlFor="admin-password">
              Security Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="admin-form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="admin-btn-primary"
            disabled={submitting}
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to Portal'}</span>
            <ArrowRight size={16} weight="bold" />
          </button>
        </form>

        <div className="admin-login-divider">
          <span>Or Quick Access</span>
        </div>

        {/* 1-Click Demo Login Button */}
        <button
          type="button"
          onClick={handleDemoSignIn}
          className="admin-btn-demo"
          disabled={submitting}
          title="Instant access with pre-configured dealership owner demo account"
        >
          <Sparkle size={16} weight="fill" />
          <span>Launch Demo Admin (admin@zaracars.com)</span>
        </button>

        <div className="admin-login-footer">
          <Link to="/" className="admin-login-back">
            <ArrowLeft size={14} />
            <span>Return to Public Showroom</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
