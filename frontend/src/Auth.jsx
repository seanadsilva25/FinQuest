
import { useState } from 'react'
import './Auth.css'

const API_URL = 'http://localhost:5000/api/auth'

function Auth({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isRegister ? 'register' : 'login'

      const response = await fetch(`${API_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isRegister
            ? { name, email, password }
            : { email, password }
        ),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }

      localStorage.setItem('finquest_token', data.token)
      localStorage.setItem('finquest_user', JSON.stringify(data.user))

      onLogin(data.user)
    } catch (err) {
      setError(err.message || 'Unable to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">F</div>
          <span>Fin<span>Quest</span></span>
        </div>

        <div className="auth-hero">
          <div className="auth-eyebrow">YOUR MONEY. YOUR FUTURE.</div>
          <h1>Make every<br />financial decision<br /><span>count.</span></h1>
          <p>
            Build better money habits, explore investing,
            and take control of your financial journey.
          </p>

          <div className="auth-feature">
            <span>✦</span>
            Learn through interactive financial challenges
          </div>
          <div className="auth-feature">
            <span>↗</span>
            Practice investing without real-world risk
          </div>
          <div className="auth-feature">
            <span>❄</span>
            Make mindful spending decisions
          </div>
        </div>

        <div className="auth-footer">FinQuest · Your journey starts here.</div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <div className="auth-brand-icon">F</div>
            <span>Fin<span>Quest</span></span>
          </div>

          <div className="auth-heading">
            <div className="auth-eyebrow">
              {isRegister ? 'JOIN THE JOURNEY' : 'WELCOME BACK'}
            </div>
            <h2>{isRegister ? 'Create your account' : 'Sign in to FinQuest'}</h2>
            <p>
              {isRegister
                ? 'Start building smarter financial habits today.'
                : 'Your financial journey is waiting for you.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="auth-field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : isRegister
                  ? 'Create account →'
                  : 'Sign in →'}
            </button>
          </form>

          <div className="auth-switch">
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
            >
              {isRegister ? 'Sign in' : 'Create account'}
            </button>
          </div>

          <div className="auth-demo-note">
            <span>✦</span> Practice, learn, and grow at your own pace.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth