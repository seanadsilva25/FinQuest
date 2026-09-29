
import { useState, useEffect } from 'react'
import './App.css'
import Auth from './Auth'

const menuItems = [
  { id: 'Dashboard', icon: '▦' },
  { id: 'Investments', icon: '↗' },
  { id: 'Spending Tracker', icon: '◷' },
  { id: 'Cool-Off Guard', icon: '❄' },
  { id: 'Learn & Play', icon: '✧' },
]

function Dashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('Dashboard')

  // Wallet state
  const [walletBalance, setWalletBalance] = useState(null)
  const [walletError, setWalletError] = useState('')

  // Fetch wallet balance from MongoDB
  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem('finquest_token')

      if (!token) {
        setWalletError('Please log in again.')
        return
      }

      try {
        const response = await fetch('http://localhost:5000/api/wallet', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch wallet')
        }

        setWalletBalance(data.wallet.balance)
      } catch (error) {
        console.error('Wallet fetch error:', error)
        setWalletError(error.message)
      }
    }

    fetchWallet()
  }, [])

  const [transactions] = useState([
    {
      name: 'Grocery shopping',
      category: 'Food & Essentials',
      amount: 1250,
      type: 'expense',
    },
    {
      name: 'Monthly SIP',
      category: 'Investments',
      amount: 2000,
      type: 'investment',
    },
    {
      name: 'Coffee & snacks',
      category: 'Food & Essentials',
      amount: 350,
      type: 'expense',
    },
    {
      name: 'Freelance payment',
      category: 'Income',
      amount: 5000,
      type: 'income',
    },
  ])

  const pageDescriptions = {
    Dashboard: 'Your financial life, all in one place.',
    Investments: 'Build confidence through virtual investing.',
    'Spending Tracker': 'Understand your spending habits.',
    'Cool-Off Guard': 'Pause before you make impulsive purchases.',
    'Learn & Play': 'Learn money skills through interactive challenges.',
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <span>
            Fin<span className="brand-highlight">Quest</span>
          </span>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                activePage === item.id ? 'active' : ''
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.id}
              {item.id === 'Learn & Play' && (
                <span className="new-badge">NEW</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Small steps, big goals.</strong>
            <p>
              Every smart financial decision moves you forward.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">S</div>
            <div>
              <strong>Seana</strong>
              <span>Quest Explorer</span>
            </div>
            <span className="profile-dots">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span>FinQuest</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <span className="today-label">
              Your financial journey
            </span>

            <button
              className="notification-button"
              aria-label="Notifications"
            >
              ♧
            </button>

            <div className="top-avatar">S</div>

            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-section">
            <div>
              <div className="eyebrow">
                YOUR MONEY. YOUR FUTURE.
              </div>

              <h1>
                {activePage === 'Dashboard'
                  ? 'Welcome back, Seana!'
                  : activePage}
              </h1>

              <p>{pageDescriptions[activePage]}</p>
            </div>

            <div className="date-chip">
              ✧ &nbsp; Keep building good habits
            </div>
          </section>

          {activePage === 'Dashboard' ? (
            <>
              <section className="stats-grid">
                <div className="stat-card balance-card">
                  <div className="stat-top">
                    <span>Virtual Wallet</span>
                    <span className="stat-icon">◈</span>
                  </div>

                  <div className="stat-value">
                    {walletBalance === null
                      ? walletError
                        ? 'Unavailable'
                        : 'Loading...'
                      : `₹${walletBalance.toLocaleString('en-IN')}`}
                  </div>

                  <div className="stat-foot">
                    {walletError ? (
                      <span>{walletError}</span>
                    ) : (
                      <>
                        <span className="positive">●</span>{' '}
                        Available for simulation
                      </>
                    )}
                  </div>

                  <div className="balance-decoration">₹</div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Portfolio Value</span>
                    <span className="stat-icon purple">↗</span>
                  </div>

                  <div className="stat-value">₹25,450</div>

                  <div className="stat-foot">
                    <span className="positive">↗ 4.8%</span>
                    <span> simulated returns</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Monthly Spending</span>
                    <span className="stat-icon orange">◷</span>
                  </div>

                  <div className="stat-value">₹8,450</div>

                  <div className="stat-foot">
                    Of ₹15,000 monthly budget
                  </div>

                  <div className="progress-track">
                    <div className="progress-fill" />
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    <span>Smart Decisions</span>
                    <span className="stat-icon green">✦</span>
                  </div>

                  <div className="stat-value">12</div>

                  <div className="stat-foot">
                    <span className="positive">↑ 3</span> this week
                  </div>
                </div>
              </section>

              <section className="content-grid">
                <div className="panel portfolio-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Portfolio Overview</h2>
                      <p>
                        Your simulated investment performance
                      </p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => setActivePage('Investments')}
                    >
                      View portfolio ↗
                    </button>
                  </div>

                  <div className="portfolio-total">
                    <div>
                      <span className="muted-label">
                        Total invested
                      </span>
                      <h2>₹24,000</h2>
                    </div>

                    <div className="return-pill">
                      + ₹1,450 (6.04%)
                    </div>
                  </div>

                  <div className="chart-area">
                    <div className="chart-y-labels">
                      <span>₹30k</span>
                      <span>₹25k</span>
                      <span>₹20k</span>
                      <span>₹15k</span>
                    </div>

                    <svg
                      className="portfolio-chart"
                      viewBox="0 0 600 190"
                      preserveAspectRatio="none"
                      role="img"
                      aria-label="Illustrative portfolio growth chart"
                    >
                      <defs>
                        <linearGradient
                          id="chartFill"
                          x1="0"
                          x2="0"
                          y1="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b75e8"
                            stopOpacity=".28"
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b75e8"
                            stopOpacity="0"
                          />
                        </linearGradient>
                      </defs>

                      <path
                        d="M0 150 C35 143 45 132 75 139 S120 125 150 129 S190 95 225 112 S270 90 300 102 S345 78 375 90 S420 60 450 73 S500 42 525 55 S570 30 600 18 L600 190 L0 190 Z"
                        fill="url(#chartFill)"
                      />

                      <path
                        d="M0 150 C35 143 45 132 75 139 S120 125 150 129 S190 95 225 112 S270 90 300 102 S345 78 375 90 S420 60 450 73 S500 42 525 55 S570 30 600 18"
                        fill="none"
                        stroke="#8066df"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="chart-labels">
                    <span>Week 1</span>
                    <span>Week 2</span>
                    <span>Week 3</span>
                    <span>Week 4</span>
                  </div>

                  <div className="chart-note">
                    Illustrative demo data — not live market prices.
                  </div>
                </div>

                <div className="panel goal-panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Spending Snapshot</h2>
                      <p>Monthly budget progress</p>
                    </div>

                    <span className="stat-icon orange">◷</span>
                  </div>

                  <div className="budget-circle">
                    <div className="budget-circle-inner">
                      <strong>56%</strong>
                      <span>used</span>
                    </div>
                  </div>

                  <div className="budget-legend">
                    <div>
                      <span className="legend-dot purple-dot" />
                      Spent <strong>₹8,450</strong>
                    </div>

                    <div>
                      <span className="legend-dot light-dot" />
                      Remaining <strong>₹6,550</strong>
                    </div>
                  </div>

                  <div className="budget-tip">
                    ✦ You're within your monthly budget. Keep it up!
                  </div>
                </div>
              </section>

              <section className="panel transactions-panel">
                <div className="panel-heading">
                  <div>
                    <h2>Recent Activity</h2>
                    <p>
                      A quick look at your financial moves
                    </p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() =>
                      setActivePage('Spending Tracker')
                    }
                  >
                    See all activity ↗
                  </button>
                </div>

                <div className="transaction-list">
                  {transactions.map((transaction, index) => (
                    <div className="transaction-row" key={index}>
                      <div
                        className={`transaction-icon transaction-${transaction.type}`}
                      >
                        {transaction.type === 'income'
                          ? '↓'
                          : transaction.type === 'investment'
                            ? '↗'
                            : '◷'}
                      </div>

                      <div className="transaction-name">
                        <strong>{transaction.name}</strong>
                        <span>{transaction.category}</span>
                      </div>

                      <div
                        className={`transaction-amount ${
                          transaction.type === 'income'
                            ? 'positive'
                            : ''
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '−'}₹
                        {transaction.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cooloff-banner">
                <div className="cooloff-symbol">❄</div>

                <div className="cooloff-copy">
                  <span>THE COOL-OFF CHALLENGE</span>
                  <h3>Pause. Reflect. Then decide.</h3>
                  <p>
                    Thinking about an unplanned purchase? Give
                    yourself a moment before spending.
                  </p>
                </div>

                <button
                  onClick={() => setActivePage('Cool-Off Guard')}
                >
                  Explore cool-off guard <span>→</span>
                </button>
              </section>
            </>
          ) : (
            <section className="panel coming-soon">
              <div className="coming-icon">
                {menuItems.find(
                  (item) => item.id === activePage
                )?.icon}
              </div>

              <h2>{activePage}</h2>

              <p>
                This section is part of the FinQuest experience.
                We'll connect its features to the backend next.
              </p>

              <button
                className="primary-button"
                onClick={() => setActivePage('Dashboard')}
              >
                Back to dashboard
              </button>
            </section>
          )}

          <footer className="footer">
            FinQuest · Make every financial decision count.
          </footer>
        </div>
      </main>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('finquest_user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('finquest_token')
    localStorage.removeItem('finquest_user')
    setUser(null)
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />
  }

  return <Dashboard onLogout={handleLogout} />
}

export default App