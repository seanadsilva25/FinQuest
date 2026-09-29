
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

  // Investment simulation state
  const [stocks, setStocks] = useState([])
  const [portfolio, setPortfolio] = useState([])
  const [transactionHistory, setTransactionHistory] = useState([])
  const [transactionHistoryError, setTransactionHistoryError] = useState('')
  const [investmentLoading, setInvestmentLoading] = useState(false)
  const [investmentError, setInvestmentError] = useState('')
  const [investmentMessage, setInvestmentMessage] = useState('')
  const [selectedStock, setSelectedStock] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [tradeLoading, setTradeLoading] = useState(false)

  // Impulse spending tracker state
  const [expenses, setExpenses] = useState([])
  const [expenseLoading, setExpenseLoading] = useState(false)
  const [expenseError, setExpenseError] = useState('')
  const [expenseMessage, setExpenseMessage] = useState('')
  const [expenseSaving, setExpenseSaving] = useState(false)
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: 'Food',
    description: '',
    type: 'Planned',
    trigger: '',
    date: new Date().toISOString().slice(0, 10),
  })

  const fetchExpenses = async () => {
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setExpenseError('Please log in again.')
      return
    }
    setExpenseLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to fetch expenses')
      setExpenses(data.expenses || [])
      setExpenseError('')
    } catch (error) {
      console.error('Expense fetch error:', error)
      setExpenseError(error.message)
    } finally {
      setExpenseLoading(false)
    }
  }

  const submitExpense = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setExpenseError('Please log in again.')
      return
    }
    setExpenseSaving(true)
    setExpenseError('')
    setExpenseMessage('')
    try {
      const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...expenseForm,
          amount: Number(expenseForm.amount),
          trigger: expenseForm.type === 'Impulse' ? expenseForm.trigger : '',
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to add expense')
      setExpenseMessage('Expense saved successfully.')
      setExpenseForm({
        amount: '', category: 'Food', description: '', type: 'Planned',
        trigger: '', date: new Date().toISOString().slice(0, 10),
      })
      await fetchExpenses()
    } catch (error) {
      console.error('Add expense error:', error)
      setExpenseError(error.message)
    } finally {
      setExpenseSaving(false)
    }
  }

  const removeExpense = async (expenseId) => {
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setExpenseError('Please log in again.')
      return
    }
    try {
      const response = await fetch(`http://localhost:5000/api/expenses/${expenseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to delete expense')
      setExpenseMessage('Expense deleted.')
      await fetchExpenses()
    } catch (error) {
      console.error('Delete expense error:', error)
      setExpenseError(error.message)
    }
  }

  const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const impulseExpense = expenses
    .filter((expense) => expense.type === 'Impulse')
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const plannedExpense = totalExpense - impulseExpense
  const impulseRatio = totalExpense > 0 ? (impulseExpense / totalExpense) * 100 : 0

  // Cool-Off Guardrail state
  const [coolOffs, setCoolOffs] = useState([])
  const [coolOffLoading, setCoolOffLoading] = useState(false)
  const [coolOffError, setCoolOffError] = useState('')
  const [coolOffMessage, setCoolOffMessage] = useState('')
  const [coolOffSaving, setCoolOffSaving] = useState(false)
  const [coolOffForm, setCoolOffForm] = useState({
    productName: '', amount: '', category: 'Shopping', reason: '',
  })

  const fetchCoolOffs = async () => {
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setCoolOffError('Please log in again.')
      return
    }
    setCoolOffLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/cool-off', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to fetch cool-off requests')
      setCoolOffs(Array.isArray(data) ? data : data.coolOffs || [])
      setCoolOffError('')
    } catch (error) {
      console.error('Cool-off fetch error:', error)
      setCoolOffError(error.message)
    } finally {
      setCoolOffLoading(false)
    }
  }

  const submitCoolOff = async (event) => {
    event.preventDefault()
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setCoolOffError('Please log in again.')
      return
    }
    setCoolOffSaving(true)
    setCoolOffError('')
    setCoolOffMessage('')
    try {
      const response = await fetch('http://localhost:5000/api/cool-off', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...coolOffForm, amount: Number(coolOffForm.amount) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to add purchase')
      setCoolOffMessage('Purchase added. Take 24 hours to think it over.')
      setCoolOffForm({ productName: '', amount: '', category: 'Shopping', reason: '' })
      await fetchCoolOffs()
    } catch (error) {
      console.error('Create cool-off error:', error)
      setCoolOffError(error.message)
    } finally {
      setCoolOffSaving(false)
    }
  }

  const decideCoolOff = async (purchaseId, status) => {
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setCoolOffError('Please log in again.')
      return
    }
    setCoolOffError('')
    setCoolOffMessage('')
    try {
      const response = await fetch(`http://localhost:5000/api/cool-off/${purchaseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to update decision')
      setCoolOffMessage(`Purchase marked as ${status.toLowerCase()}.`)
      await fetchCoolOffs()
    } catch (error) {
      console.error('Cool-off decision error:', error)
      setCoolOffError(error.message)
    }
  }

  const avoidedTotal = coolOffs
    .filter((purchase) => purchase.status === 'Avoided')
    .reduce((sum, purchase) => sum + Number(purchase.amount || 0), 0)
  const pendingCoolOffs = coolOffs.filter((purchase) => purchase.status === 'Pending')
  const completedCoolOffs = coolOffs.filter((purchase) => purchase.status !== 'Pending')

  // Fetch the logged-in user's saved portfolio from MongoDB
  const fetchPortfolio = async () => {
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setInvestmentError('Please log in again.')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/portfolio', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to fetch portfolio')
      setPortfolio(data.holdings || [])
    } catch (error) {
      console.error('Portfolio fetch error:', error)
      setInvestmentError(error.message)
    }
  }

  // Fetch the logged-in user's real investment transaction history
  const fetchTransactionHistory = async () => {
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setTransactionHistoryError('Please log in again.')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Unable to fetch transaction history')
      }
      setTransactionHistory(data.transactions || [])
      setTransactionHistoryError('')
    } catch (error) {
      console.error('Transaction history fetch error:', error)
      setTransactionHistoryError(error.message)
    }
  }

  // Fetch stocks, holdings, and transaction history when Dashboard or Investments is opened
  useEffect(() => {
    if (activePage !== 'Investments' && activePage !== 'Dashboard') return

    const fetchStocks = async () => {
      setInvestmentLoading(true)
      setInvestmentError('')
      try {
        const response = await fetch('http://localhost:5000/api/stocks')
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Unable to fetch stocks')
        setStocks(data.stocks || [])
      } catch (error) {
        console.error('Stocks fetch error:', error)
        setInvestmentError(error.message)
      } finally {
        setInvestmentLoading(false)
      }
    }

    fetchStocks()
    fetchPortfolio()
    fetchTransactionHistory()
  }, [activePage])

  useEffect(() => {
    if (activePage === 'Spending Tracker') fetchExpenses()
  }, [activePage])

  useEffect(() => {
    if (activePage === 'Cool-Off Guard') fetchCoolOffs()
  }, [activePage])

  const executeTrade = async (type) => {
    const token = localStorage.getItem('finquest_token')
    if (!token) {
      setInvestmentError('Please log in again.')
      return
    }
    if (!selectedStock || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
      setInvestmentError('Select a stock and enter a valid whole-number quantity.')
      return
    }

    setTradeLoading(true)
    setInvestmentError('')
    setInvestmentMessage('')
    try {
      const response = await fetch(`http://localhost:5000/api/transactions/${type.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stockId: selectedStock, quantity: Number(quantity) }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || `Unable to ${type.toLowerCase()} stock`)

      setWalletBalance(data.walletBalance)
      await fetchPortfolio()
      await fetchTransactionHistory()
      setInvestmentMessage(data.message || `Stock ${type.toLowerCase()} successful.`)
      setQuantity(1)
    } catch (error) {
      console.error(`${type} stock error:`, error)
      setInvestmentError(error.message)
    } finally {
      setTradeLoading(false)
    }
  }

  // Calculate portfolio totals from saved holdings and current stock prices
  const totalInvested = portfolio.reduce((sum, holding) => {
    return sum + holding.quantity * holding.averageBuyPrice
  }, 0)

  const portfolioValue = portfolio.reduce((sum, holding) => {
    const holdingStockId = holding.stockId?._id || holding.stockId
    const stock = stocks.find((item) => item._id === holdingStockId)
    const currentPrice = holding.stockId?.currentPrice ?? stock?.currentPrice ?? holding.averageBuyPrice
    return sum + holding.quantity * currentPrice
  }, 0)

  const portfolioReturns = portfolioValue - totalInvested
  const portfolioReturnPercent = totalInvested > 0
    ? (portfolioReturns / totalInvested) * 100
    : 0

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

                  <div className="stat-value">₹{portfolioValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>

                  <div className="stat-foot">
                    <span className={portfolioReturns >= 0 ? 'positive' : ''}>
                      {portfolioReturns >= 0 ? '↗ +' : '↘ −'}₹{Math.abs(portfolioReturns).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </span>{' '}
                    ({portfolioReturnPercent.toFixed(2)}% simulated return)
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
                      <h2>₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h2>
                    </div>

                    <div className="return-pill">
                      {portfolioReturns >= 0 ? '+' : '−'} ₹{Math.abs(portfolioReturns).toLocaleString('en-IN', { maximumFractionDigits: 2 })} ({portfolioReturnPercent.toFixed(2)}%)
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
                    Portfolio totals use your saved holdings and sample stock prices; chart remains illustrative demo data.
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
          ) : activePage === 'Investments' ? (
            <>
              <section className="panel" style={{ marginBottom: '20px' }}>
                <div className="panel-heading">
                  <div>
                    <h2>Available Stocks</h2>
                    <p>Practice investing with virtual money. Prices are sample values, not live market data.</p>
                  </div>
                  <span className="stat-icon purple">↗</span>
                </div>

                {investmentLoading ? (
                  <p>Loading stocks...</p>
                ) : investmentError && stocks.length === 0 ? (
                  <p role="alert">{investmentError}</p>
                ) : stocks.length === 0 ? (
                  <p>No stocks are currently available.</p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
                    {stocks.map((stock) => (
                      <button
                        key={stock._id}
                        type="button"
                        onClick={() => { setSelectedStock(stock._id); setInvestmentError(''); setInvestmentMessage('') }}
                        style={{ textAlign: 'left', padding: '16px', borderRadius: '12px', border: selectedStock === stock._id ? '2px solid #8066df' : '1px solid #e5e1ef', background: selectedStock === stock._id ? '#f7f4ff' : '#fff', cursor: 'pointer' }}
                      >
                        <strong>{stock.name}</strong>
                        <div style={{ color: '#777', marginTop: '4px' }}>{stock.symbol}</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, marginTop: '12px' }}>₹{stock.currentPrice.toLocaleString('en-IN')}</div>
                        <div style={{ color: stock.priceChange >= 0 ? '#16834a' : '#c43d4b', marginTop: '4px' }}>
                          {stock.priceChange >= 0 ? '▲ +' : '▼ '}₹{Math.abs(stock.priceChange).toLocaleString('en-IN')}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="panel" style={{ marginBottom: '20px' }}>
                <h2>Trade Stocks</h2>
                <p>Select a stock above, enter the quantity, and choose Buy or Sell.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'end', marginTop: '16px' }}>
                  <label style={{ display: 'grid', gap: '6px' }}>
                    <span>Quantity</span>
                    <input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px', width: '130px' }} />
                  </label>
                  <button className="primary-button" disabled={tradeLoading || !selectedStock} onClick={() => executeTrade('buy')}>
                    {tradeLoading ? 'Processing...' : 'Buy Stock'}
                  </button>
                  <button className="primary-button" disabled={tradeLoading || !selectedStock} onClick={() => executeTrade('sell')}>
                    {tradeLoading ? 'Processing...' : 'Sell Stock'}
                  </button>
                </div>
                {investmentError && <p role="alert" style={{ color: '#c43d4b', marginTop: '12px' }}>{investmentError}</p>}
                {investmentMessage && <p role="status" style={{ color: '#16834a', marginTop: '12px' }}>{investmentMessage}</p>}
                <p style={{ marginTop: '12px' }}>Available wallet balance: <strong>{walletBalance === null ? 'Loading...' : `₹${walletBalance.toLocaleString('en-IN')}`}</strong></p>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>My Portfolio</h2>
                    <p>Your saved holdings, retrieved from your FinQuest account.</p>
                  </div>
                </div>
                {portfolio.length === 0 ? (
                  <p>You don't have any stock holdings yet. Buy a stock to start building your portfolio.</p>
                ) : (
                  <div className="transaction-list">
                    {portfolio.map((holding) => {
                      const stock = stocks.find((item) => item._id === (holding.stockId?._id || holding.stockId))
                      return (
                        <div className="transaction-row" key={holding.stockId?._id || holding.stockId}>
                          <div className="transaction-icon transaction-investment">↗</div>
                          <div className="transaction-name">
                            <strong>{stock?.name || 'Stock'}</strong>
                            <span>{holding.quantity} shares · Average buy price ₹{holding.averageBuyPrice.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="transaction-amount">₹{(holding.quantity * (stock?.currentPrice || holding.averageBuyPrice)).toLocaleString('en-IN')}</div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </section>

              <section className="panel" style={{ marginTop: '20px' }}>
                <div className="panel-heading">
                  <div>
                    <h2>Transaction History</h2>
                    <p>Your actual stock purchases and sales saved to your FinQuest account.</p>
                  </div>
                </div>

                {transactionHistoryError ? (
                  <p role="alert" style={{ color: '#c43d4b' }}>{transactionHistoryError}</p>
                ) : transactionHistory.length === 0 ? (
                  <p>No investment transactions yet. Your buy and sell activity will appear here.</p>
                ) : (
                  <div className="transaction-list">
                    {transactionHistory.map((transaction) => (
                      <div className="transaction-row" key={transaction._id}>
                        <div className={`transaction-icon ${transaction.type === 'BUY' ? 'transaction-investment' : 'transaction-income'}`}>
                          {transaction.type === 'BUY' ? '↗' : '↓'}
                        </div>
                        <div className="transaction-name">
                          <strong>{transaction.stockId?.name || 'Stock'} · {transaction.type}</strong>
                          <span>
                            {transaction.stockId?.symbol || '—'} · {transaction.quantity} {transaction.quantity === 1 ? 'share' : 'shares'} · ₹{Number(transaction.price).toLocaleString('en-IN')} per share
                          </span>
                          <span>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleString('en-IN') : 'Date unavailable'}</span>
                        </div>
                        <div className={`transaction-amount ${transaction.type === 'SELL' ? 'positive' : ''}`}>
                          {transaction.type === 'BUY' ? '−' : '+'}₹{Number(transaction.totalAmount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : activePage === 'Spending Tracker' ? (
            <>
              <style>{`
                .spend-page { display: grid; gap: 22px; }
                .spend-hero { background: linear-gradient(120deg, #30245e, #6550a8); color: #fff; border-radius: 20px; padding: 26px 30px; display: flex; justify-content: space-between; align-items: center; gap: 20px; overflow: hidden; }
                .spend-hero h2 { margin: 0 0 8px; font-size: 24px; letter-spacing: -.5px; }
                .spend-hero p { margin: 0; color: #e6defc; max-width: 560px; line-height: 1.55; }
                .spend-hero-mark { width: 82px; height: 82px; border: 1px solid #ffffff45; background: #ffffff12; border-radius: 24px; display: grid; place-items: center; font-size: 38px; flex: 0 0 auto; }
                .spend-metrics { display: grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap: 14px; }
                .spend-metric { background: var(--card-bg, #fff); border: 1px solid var(--border-color, #e9e5f1); border-radius: 16px; padding: 18px; min-width: 0; box-shadow: 0 4px 16px #30245e10; }
                .spend-metric-label { color: var(--muted-text, #77718a); font-size: 13px; font-weight: 600; display:flex; justify-content:space-between; gap:8px; }
                .spend-metric-value { font-size: clamp(21px, 2.5vw, 29px); font-weight: 750; margin: 12px 0 5px; letter-spacing: -.7px; color: var(--text-primary, #2f2942); }
                .spend-metric-note { font-size: 12px; color: var(--muted-text, #89839b); }
                .spend-layout { display:grid; grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr); gap:18px; align-items:start; }
                .spend-card { background: var(--card-bg, #fff); border:1px solid var(--border-color, #e9e5f1); border-radius:18px; padding:22px; box-shadow: 0 4px 16px #30245e0a; min-width:0; }
                .spend-card-head { margin-bottom:18px; }
                .spend-card-head h3 { margin:0 0 6px; font-size:17px; color:var(--text-primary, #2f2942); }
                .spend-card-head p { margin:0; color:var(--muted-text, #89839b); font-size:13px; line-height:1.5; }
                .spend-form { display:grid; gap:14px; }
                .spend-form label { display:grid; gap:7px; font-size:13px; font-weight:650; color:var(--text-primary, #3d3554); }
                .spend-form input, .spend-form select { width:100%; box-sizing:border-box; border:1px solid var(--border-color, #e4deef); background:var(--input-bg, #fff); color:var(--text-primary, #2f2942); border-radius:10px; padding:11px 12px; font:inherit; font-size:14px; outline:none; }
                .spend-form input:focus, .spend-form select:focus { border-color:#8066df; box-shadow:0 0 0 3px #8066df1c; }
                .spend-submit { width:100%; border:0; border-radius:11px; padding:13px 16px; background:#8066df; color:white; font-weight:700; cursor:pointer; }
                .spend-submit:disabled { opacity:.6; cursor:wait; }
                .spend-list { display:grid; gap:10px; }
                .spend-item { display:flex; align-items:center; gap:12px; padding:13px 0; border-bottom:1px solid var(--border-color, #eeeaf4); min-width:0; }
                .spend-item:last-child { border-bottom:0; padding-bottom:0; }
                .spend-item-icon { width:42px; height:42px; flex:0 0 42px; border-radius:13px; display:grid; place-items:center; font-size:18px; background:#f0ecfc; color:#7057c7; }
                .spend-item-icon.impulse { background:#fff1e6; color:#bd682b; }
                .spend-item-main { min-width:0; flex:1; display:grid; gap:4px; }
                .spend-item-main strong { color:var(--text-primary, #2f2942); font-size:14px; overflow-wrap:anywhere; }
                .spend-item-main span { color:var(--muted-text, #89839b); font-size:12px; line-height:1.45; }
                .spend-item-amount { font-weight:750; font-size:14px; white-space:nowrap; color:var(--text-primary, #2f2942); }
                .spend-delete { border:0; background:transparent; color:#a35b5b; font-size:12px; cursor:pointer; padding:7px; }
                .spend-empty { border:1px dashed var(--border-color, #e4deef); border-radius:13px; padding:28px 16px; text-align:center; color:var(--muted-text, #89839b); font-size:13px; }
                @media(max-width:900px) { .spend-metrics { grid-template-columns:repeat(2,minmax(0,1fr)); } .spend-layout { grid-template-columns:1fr; } }
                @media(max-width:560px) { .spend-hero { padding:20px; } .spend-hero-mark { display:none; } .spend-metrics { gap:9px; } .spend-metric { padding:14px; } }
              `}</style>
              <div className="spend-page">
                <section className="spend-hero">
                  <div><div style={{fontSize:12, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase', color:'#d8cdfb', marginBottom:10}}>Mindful money</div><h2>Make every rupee count.</h2><p>Build awareness around your spending, spot impulse patterns, and make more intentional choices—one purchase at a time.</p></div>
                  <div className="spend-hero-mark" aria-hidden="true">₹</div>
                </section>
                <section className="spend-metrics">
                  <div className="spend-metric"><div className="spend-metric-label">Total tracked <span>◉</span></div><div className="spend-metric-value">₹{totalExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div><div className="spend-metric-note">Across {expenses.length} saved {expenses.length === 1 ? 'expense' : 'expenses'}</div></div>
                  <div className="spend-metric"><div className="spend-metric-label">Impulse spending <span style={{color:'#c77a37'}}>↗</span></div><div className="spend-metric-value">₹{impulseExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div><div className="spend-metric-note">Purchases marked impulsive</div></div>
                  <div className="spend-metric"><div className="spend-metric-label">Planned spending <span style={{color:'#8066df'}}>✓</span></div><div className="spend-metric-value">₹{plannedExpense.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div><div className="spend-metric-note">Purchases made with a plan</div></div>
                  <div className="spend-metric"><div className="spend-metric-label">Impulse ratio <span style={{color:'#8066df'}}>%</span></div><div className="spend-metric-value">{impulseRatio.toFixed(1)}%</div><div className="spend-metric-note">Share of tracked spending</div><div style={{height:5, background:'#eeeaf4', borderRadius:9, overflow:'hidden', marginTop:11}}><div style={{height:'100%', width:`${Math.min(impulseRatio,100)}%`, background:'#c58a51', borderRadius:9, transition:'width .25s'}}/></div></div>
                </section>
                <div className="spend-layout">
                  <section className="spend-card">
                    <div className="spend-card-head"><h3>Log an expense</h3><p>Capture the details while they're fresh. A little reflection goes a long way.</p></div>
                    <form className="spend-form" onSubmit={submitExpense}>
                      <label>Amount (₹)<input required type="number" min="0.01" step="0.01" value={expenseForm.amount} onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })} placeholder="e.g. 850" /></label>
                      <label>What was it for?<input type="text" maxLength="200" value={expenseForm.description} onChange={(event) => setExpenseForm({ ...expenseForm, description: event.target.value })} placeholder="Add a short description" /></label>
                      <label>Category<select value={expenseForm.category} onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })}>{['Food', 'Shopping', 'Entertainment', 'Travel', 'Bills', 'Health', 'Education', 'Other'].map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                      <label>Spending type<select value={expenseForm.type} onChange={(event) => setExpenseForm({ ...expenseForm, type: event.target.value })}><option value="Planned">Planned</option><option value="Impulse">Impulse</option></select></label>
                      {expenseForm.type === 'Impulse' && <label>What triggered it? (optional)<input type="text" maxLength="200" value={expenseForm.trigger} onChange={(event) => setExpenseForm({ ...expenseForm, trigger: event.target.value })} placeholder="e.g. Flash sale, mood, social media" /></label>}
                      <label>Date<input required type="date" value={expenseForm.date} onChange={(event) => setExpenseForm({ ...expenseForm, date: event.target.value })} /></label>
                      <button className="spend-submit" type="submit" disabled={expenseSaving}>{expenseSaving ? 'Saving expense…' : '+ Save expense'}</button>
                    </form>
                    {expenseError && <p role="alert" style={{color:'#c43d4b', marginTop:12, fontSize:13}}>{expenseError}</p>}
                    {expenseMessage && <p role="status" style={{color:'#16834a', marginTop:12, fontSize:13}}>{expenseMessage}</p>}
                  </section>
                  <section className="spend-card">
                    <div className="spend-card-head" style={{display:'flex',justifyContent:'space-between',alignItems:'start',gap:12}}><div><h3>Recent activity</h3><p>Your saved expenses, newest first.</p></div><button type="button" className="text-button" onClick={fetchExpenses}>Refresh ↻</button></div>
                    {expenseLoading ? <div className="spend-empty">Loading your expenses…</div> : expenses.length === 0 ? <div className="spend-empty">Your spending story starts here.<br/>Add your first expense to see it appear.</div> : <div className="spend-list">{expenses.map((expense) => <div className="spend-item" key={expense._id}><div className={`spend-item-icon ${expense.type === 'Impulse' ? 'impulse' : ''}`}>{expense.type === 'Impulse' ? '!' : '✓'}</div><div className="spend-item-main"><strong>{expense.description || expense.category}</strong><span>{expense.category} · {expense.type}{expense.trigger ? ` · Trigger: ${expense.trigger}` : ''}</span><span>{expense.date ? new Date(expense.date).toLocaleDateString('en-IN') : 'Date unavailable'}</span></div><div style={{display:'grid',justifyItems:'end',gap:4}}><div className="spend-item-amount">−₹{Number(expense.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div><button type="button" className="spend-delete" onClick={() => removeExpense(expense._id)} aria-label={`Delete ${expense.description || expense.category}`}>Delete</button></div></div>)}</div>}
                  </section>
                </div>
              </div>
            </>
          ) : activePage === 'Cool-Off Guard' ? (
            <>
              <style>{`
                .cool-page{display:flex;flex-direction:column;gap:20px;color:#211a49}
                .cool-hero{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:26px 30px;border-radius:20px;background:linear-gradient(110deg,#f0ebff 0%,#faf8ff 68%,#e9e2ff 100%);border:1px solid #e8e0fb;overflow:hidden}
                .cool-hero-copy{display:flex;align-items:center;gap:18px;min-width:0}
                .cool-hero-icon,.cool-section-icon{display:grid;place-items:center;flex:0 0 auto;border-radius:16px;background:#e7ddff;color:#7655d9;font-size:30px;width:66px;height:66px}
                .cool-hero h1{font-size:clamp(26px,3vw,36px);margin:0 0 7px;color:#241a57;letter-spacing:-.7px}
                .cool-hero p{margin:0;color:#6f6890;line-height:1.6}
                .cool-hero-note{background:#fff;border:1px solid #e9e2fb;border-radius:14px;padding:15px 18px;color:#6e5bb0;max-width:230px;line-height:1.5;font-size:14px}
                .cool-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
                .cool-stat{background:#fff;border:1px solid #ebe8f3;border-radius:17px;padding:20px 22px;box-shadow:0 5px 18px rgba(45,31,92,.035)}
                .cool-stat-top{display:flex;align-items:center;justify-content:space-between;color:#77718e;font-size:14px;gap:10px}
                .cool-stat-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:13px;background:#f1edff;color:#7959dc;font-size:22px}
                .cool-stat-icon.orange{background:#fff4e9;color:#dc913a}.cool-stat-icon.green{background:#eaf8f3;color:#219a7a}
                .cool-stat-value{font-size:30px;font-weight:750;letter-spacing:-.5px;color:#251b56;margin:10px 0 4px}
                .cool-stat-note{font-size:13px;color:#918ba5;line-height:1.5}
                .cool-main{display:grid;grid-template-columns:minmax(280px,.82fr) minmax(0,1.35fr);gap:16px;align-items:stretch}
                .cool-panel{background:#fff;border:1px solid #ebe8f3;border-radius:18px;padding:22px;box-shadow:0 5px 18px rgba(45,31,92,.035);min-width:0}
                .cool-panel-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:18px}
                .cool-head-title{display:flex;align-items:center;gap:12px}
                .cool-section-icon{width:48px;height:48px;border-radius:14px;font-size:22px}
                .cool-panel h2{font-size:19px;margin:0 0 5px;color:#251b56}
                .cool-panel-head p{margin:0;color:#8a849f;font-size:13px;line-height:1.5}
                .cool-form{display:grid;gap:15px}
                .cool-form label{display:grid;gap:7px;color:#554d75;font-size:13px;font-weight:650}
                .cool-form input,.cool-form select{box-sizing:border-box;width:100%;min-width:0;height:46px;border:1px solid #e2def0!important;border-radius:10px!important;background:#fff!important;color:#2d2750!important;padding:0 13px!important;font:inherit;font-size:14px;outline:none;box-shadow:none!important}
                .cool-form input:focus,.cool-form select:focus{border-color:#9278e7!important;box-shadow:0 0 0 3px rgba(128,102,223,.12)!important}
                .cool-form input::placeholder{color:#aaa5b8}
                .cool-primary{width:100%;border:0;border-radius:11px;background:linear-gradient(135deg,#8066df,#6e4bd1);color:#fff;padding:14px 18px;font-size:14px;font-weight:650;cursor:pointer;box-shadow:0 7px 15px rgba(128,102,223,.18);transition:transform .15s,box-shadow .15s}
                .cool-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 9px 18px rgba(128,102,223,.25)}.cool-primary:disabled{opacity:.55;cursor:not-allowed}
                .cool-right{display:grid;gap:16px;min-width:0}
                .cool-refresh{border:0;background:#f5f1ff;color:#7655d9;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:650;cursor:pointer;white-space:nowrap}
                .cool-purchase-list{display:grid;gap:12px}
                .cool-purchase{display:grid;grid-template-columns:52px minmax(0,1fr) minmax(190px,.8fr);gap:14px;align-items:center;border:1px solid #eeeaf6;border-radius:14px;padding:15px;background:#fff}
                .cool-product-icon{width:50px;height:50px;display:grid;place-items:center;background:#f2edff;color:#7959dc;border-radius:13px;font-size:22px}
                .cool-product-info{min-width:0;display:grid;gap:5px}.cool-product-info strong{font-size:14px;color:#29214e;overflow-wrap:anywhere}.cool-product-info span{font-size:12px;color:#89839d;line-height:1.45}
                .cool-category{display:inline-flex!important;width:max-content;max-width:100%;background:#f3efff;color:#7252ce!important;padding:4px 8px;border-radius:7px;font-size:11px!important}
                .cool-decision{display:grid;gap:9px;min-width:0}.cool-time{display:flex;align-items:center;gap:7px;color:#6c5ab0;font-size:12px;font-weight:650}
                .cool-progress{height:7px;background:#eeeafa;border-radius:20px;overflow:hidden}.cool-progress span{display:block;height:100%;background:linear-gradient(90deg,#b8a6f5,#8066df);border-radius:20px}
                .cool-actions{display:flex;gap:8px}.cool-actions button{flex:1;border:0;border-radius:9px;padding:10px 8px;font-size:12px;font-weight:650;cursor:pointer}.cool-buy{background:#eee9ff;color:#7455cf}.cool-avoid{background:#fff0f0;color:#c84c58}.cool-actions button:disabled{opacity:.42;cursor:not-allowed}
                .cool-history{display:grid;gap:0}.cool-history-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(80px,.7fr) minmax(90px,.7fr) auto;align-items:center;gap:10px;padding:12px 4px;border-bottom:1px solid #f0edf6;font-size:13px}.cool-history-row:last-child{border-bottom:0}.cool-history-row strong{color:#332b56;font-weight:650}.cool-history-row span{color:#8b859e}.cool-status{justify-self:start;border-radius:20px;padding:5px 9px;font-size:11px;font-weight:650}.cool-status.avoided{background:#eaf8f3;color:#21866e}.cool-status.purchased{background:#f0edff;color:#7655d9}
                .cool-empty{padding:25px 14px;text-align:center;color:#9892a8;font-size:13px;background:#faf9fd;border:1px dashed #e7e2f0;border-radius:12px}
                @media(max-width:900px){.cool-main{grid-template-columns:1fr}.cool-hero-note{display:none}}
                @media(max-width:600px){.cool-stats{grid-template-columns:1fr}.cool-hero{padding:20px}.cool-hero-icon{width:50px;height:50px;font-size:24px}.cool-panel{padding:16px}.cool-purchase{grid-template-columns:44px minmax(0,1fr)}.cool-product-icon{width:42px;height:42px}.cool-decision{grid-column:1/-1}.cool-history-row{grid-template-columns:1fr auto}.cool-history-row span:nth-child(2){display:none}}
              `}</style>
              <div className="cool-page">
                <section className="cool-hero">
                  <div className="cool-hero-copy"><div className="cool-hero-icon">◷</div><div><h1>Cool-Off Guard</h1><p>Pause before you make impulsive purchases. Give yourself 24 hours to rethink and make smarter decisions.</p></div></div>
                  <div className="cool-hero-note">✦ Small pauses today, bigger financial freedom tomorrow.</div>
                </section>

                <section className="cool-stats">
                  <div className="cool-stat"><div className="cool-stat-top"><span>Pending Purchases</span><span className="cool-stat-icon orange">◷</span></div><div className="cool-stat-value">{pendingCoolOffs.length}</div><div className="cool-stat-note">Currently in the 24-hour pause</div></div>
                  <div className="cool-stat"><div className="cool-stat-top"><span>Money Saved</span><span className="cool-stat-icon green">₹</span></div><div className="cool-stat-value">₹{avoidedTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div><div className="cool-stat-note">Total value of purchases avoided</div></div>
                  <div className="cool-stat"><div className="cool-stat-top"><span>Reviewed Purchases</span><span className="cool-stat-icon">✓</span></div><div className="cool-stat-value">{completedCoolOffs.length}</div><div className="cool-stat-note">Decisions made after the pause</div></div>
                </section>

                <div className="cool-main">
                  <section className="cool-panel">
                    <div className="cool-panel-head"><div className="cool-head-title"><div className="cool-section-icon">＋</div><div><h2>Add a Purchase for Cool-Off</h2><p>Think twice before you buy. Give yourself 24 hours.</p></div></div></div>
                    <form className="cool-form" onSubmit={submitCoolOff}>
                      <label>Product or item *<input required type="text" maxLength="120" value={coolOffForm.productName} onChange={(event) => setCoolOffForm({ ...coolOffForm, productName: event.target.value })} placeholder="e.g. Wireless headphones" /></label>
                      <label>Amount (₹) *<input required type="number" min="0.01" step="0.01" value={coolOffForm.amount} onChange={(event) => setCoolOffForm({ ...coolOffForm, amount: event.target.value })} placeholder="e.g. 2500" /></label>
                      <label>Category *<select value={coolOffForm.category} onChange={(event) => setCoolOffForm({ ...coolOffForm, category: event.target.value })}>{['Food', 'Shopping', 'Entertainment', 'Travel', 'Bills', 'Health', 'Education', 'Other'].map((category) => <option key={category} value={category}>{category}</option>)}</select></label>
                      <label>Why do you want it? (Optional)<input type="text" maxLength="200" value={coolOffForm.reason} onChange={(event) => setCoolOffForm({ ...coolOffForm, reason: event.target.value })} placeholder="e.g. Limited-time sale" /></label>
                      <button className="cool-primary" type="submit" disabled={coolOffSaving}>{coolOffSaving ? 'Saving purchase…' : '＋ Start 24-hour pause'}</button>
                    </form>
                    {coolOffError && <p role="alert" style={{ color: '#c43d4b', marginTop: 12, fontSize: 13 }}>{coolOffError}</p>}
                    {coolOffMessage && <p role="status" style={{ color: '#16834a', marginTop: 12, fontSize: 13 }}>{coolOffMessage}</p>}
                  </section>

                  <div className="cool-right">
                    <section className="cool-panel">
                      <div className="cool-panel-head"><div className="cool-head-title"><div className="cool-section-icon">⌛</div><div><h2>Pending Purchases</h2><p>Decisions unlock after the 24-hour cooling-off period.</p></div></div><button className="cool-refresh" type="button" onClick={fetchCoolOffs}>Refresh ↻</button></div>
                      {coolOffLoading ? <div className="cool-empty">Loading purchases…</div> : pendingCoolOffs.length === 0 ? <div className="cool-empty">No purchases waiting right now. Add one to give yourself a pause.</div> : <div className="cool-purchase-list">{pendingCoolOffs.map((purchase) => {
                        const remaining = new Date(purchase.cooldownUntil).getTime() - Date.now()
                        const ready = remaining <= 0
                        const hours = Math.max(0, Math.floor(remaining / 3600000))
                        const minutes = Math.max(0, Math.ceil((remaining % 3600000) / 60000))
                        const progress = Math.max(0, Math.min(100, ((24 * 60 * 60 * 1000 - Math.max(0, remaining)) / (24 * 60 * 60 * 1000)) * 100))
                        return <div className="cool-purchase" key={purchase._id}><div className="cool-product-icon">◷</div><div className="cool-product-info"><strong>{purchase.productName}</strong><span className="cool-category">{purchase.category}</span>{purchase.reason && <span>{purchase.reason}</span>}<span>₹{Number(purchase.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })} · Added {new Date(purchase.createdAt).toLocaleDateString('en-IN')}</span></div><div className="cool-decision"><div className="cool-time">◷ {ready ? 'Pause complete — decide now' : `${hours}h ${minutes}m left`}</div><div className="cool-progress"><span style={{ width: `${progress}%` }} /></div><div className="cool-actions"><button className="cool-buy" type="button" disabled={!ready} onClick={() => decideCoolOff(purchase._id, 'Purchased')}>✓ Buy Now</button><button className="cool-avoid" type="button" disabled={!ready} onClick={() => decideCoolOff(purchase._id, 'Avoided')}>× Avoid</button></div></div></div>
                      })}</div>}
                    </section>

                    <section className="cool-panel">
                      <div className="cool-panel-head"><div className="cool-head-title"><div className="cool-section-icon">↺</div><div><h2>Decision History</h2><p>Purchases you decided to buy or avoid.</p></div></div></div>
                      {completedCoolOffs.length === 0 ? <div className="cool-empty">No decisions recorded yet. Your completed purchases will appear here.</div> : <div className="cool-history">{completedCoolOffs.map((purchase) => <div className="cool-history-row" key={purchase._id}><div><strong>{purchase.productName}</strong><br/><span>{new Date(purchase.decidedAt || purchase.updatedAt || purchase.createdAt).toLocaleDateString('en-IN')}</span></div><span>{purchase.category}</span><strong>₹{Number(purchase.amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong><span className={`cool-status ${purchase.status.toLowerCase()}`}>{purchase.status === 'Avoided' ? '✓ Avoided' : '✓ Purchased'}</span></div>)}</div>}
                    </section>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <section className="panel coming-soon">
              <div className="coming-icon">
                {menuItems.find((item) => item.id === activePage)?.icon}
              </div>
              <h2>{activePage}</h2>
              <p>This section is part of the FinQuest experience. We'll connect its features to the backend next.</p>
              <button className="primary-button" onClick={() => setActivePage('Dashboard')}>Back to dashboard</button>
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