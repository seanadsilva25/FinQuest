import React, { useState, useEffect, useCallback } from 'react';
import {
  getBills,
  createBill,
  updateBill,
  deleteBill,
  markBillAsPaid,
} from '../../services/billService';
import {
  getCashFlowEntries,
  createCashFlowEntry,
  deleteCashFlowEntry,
  getCashFlowSummary,
} from '../../services/cashFlowService';
import './BillsAndCashFlow.css';

const BILL_CATEGORIES = ['Utilities', 'Rent', 'Subscriptions', 'Credit Card', 'Education', 'Insurance', 'Other'];
const CASHFLOW_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investments',
  'Food & Essentials',
  'Utilities',
  'Rent',
  'Entertainment',
  'Shopping',
  'Other',
];

const BillsAndCashFlow = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Data states
  const [bills, setBills] = useState([]);
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    categoryBreakdown: {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showBillModal, setShowBillModal] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [billForm, setBillForm] = useState({
    name: '',
    amount: '',
    dueDate: '',
    category: 'Utilities',
    recurrence: 'none',
  });

  const [showCashFlowModal, setShowCashFlowModal] = useState(false);
  const [cashFlowForm, setCashFlowForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food & Essentials',
    date: new Date().toISOString().split('T')[0],
  });

  const selectedMonth = selectedDate.getMonth() + 1; // 1-12
  const selectedYear = selectedDate.getFullYear();

  // Load backend data
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [fetchedBills, fetchedEntries, fetchedSummary] = await Promise.all([
        getBills(),
        getCashFlowEntries(),
        getCashFlowSummary(selectedMonth, selectedYear),
      ]);
      setBills(fetchedBills);
      setEntries(fetchedEntries);
      setSummary(fetchedSummary);
    } catch (err) {
      setError(err.message || 'Failed to load spending tracker data.');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedYear, selectedDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedYear, selectedDate.getMonth() + 1, 1));
  };

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  // Bill Actions
  const handleOpenAddBill = () => {
    setEditingBill(null);
    setBillForm({
      name: '',
      amount: '',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Utilities',
      recurrence: 'none',
    });
    setShowBillModal(true);
  };

  const handleOpenEditBill = (bill) => {
    setEditingBill(bill);
    setBillForm({
      name: bill.name,
      amount: bill.amount,
      dueDate: new Date(bill.dueDate).toISOString().split('T')[0],
      category: bill.category || 'Other',
      recurrence: bill.recurrence || 'none',
    });
    setShowBillModal(true);
  };

  const handleSaveBill = async (e) => {
    e.preventDefault();
    try {
      if (editingBill) {
        await updateBill(editingBill._id, billForm);
      } else {
        await createBill(billForm);
      }
      setShowBillModal(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to save bill.');
    }
  };

  const handleDeleteBill = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bill?')) return;
    try {
      await deleteBill(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete bill.');
    }
  };

  const handlePayBill = async (id) => {
    try {
      await markBillAsPaid(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to mark bill as paid.');
    }
  };

  // Cash Flow Actions
  const handleOpenAddCashFlow = () => {
    setCashFlowForm({
      title: '',
      amount: '',
      type: 'expense',
      category: 'Food & Essentials',
      date: new Date().toISOString().split('T')[0],
    });
    setShowCashFlowModal(true);
  };

  const handleSaveCashFlow = async (e) => {
    e.preventDefault();
    try {
      await createCashFlowEntry(cashFlowForm);
      setShowCashFlowModal(false);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to add cash flow entry.');
    }
  };

  const handleDeleteCashFlow = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await deleteCashFlowEntry(id);
      fetchData();
    } catch (err) {
      alert(err.message || 'Failed to delete transaction.');
    }
  };

  // Upcoming Bills calculation
  const upcomingBills = bills.filter((b) => b.status === 'unpaid' || b.status === 'overdue');
  const totalUpcomingAmount = upcomingBills.reduce((acc, curr) => acc + curr.amount, 0);

  // Calendar Day Generation
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayOfWeek = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 = Sun

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const getBillsForDay = (dayNum) => {
    if (!dayNum) return [];
    return bills.filter((b) => {
      const d = new Date(b.dueDate);
      return d.getDate() === dayNum && d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear;
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="cashflow-wrapper">
      {/* Header Banner */}
      <div className="cashflow-header">
        <div>
          <span className="eyebrow">FINANCIAL CASH FLOW & BILLS</span>
          <h1>Spending Tracker</h1>
          <p>Track your monthly income, manage recurring bills, and understand your spending breakdown.</p>
        </div>

        {/* Month Selector */}
        <div className="month-picker-chip">
          <button className="month-nav-btn" onClick={handlePrevMonth}>‹</button>
          <strong>{monthNames[selectedMonth - 1]} {selectedYear}</strong>
          <button className="month-nav-btn" onClick={handleNextMonth}>›</button>
        </div>
      </div>

      {error && <div className="error-message mb-20">{error}</div>}

      {/* Summary Cards */}
      <div className="summary-cards-grid">
        <div className="stat-card income-card">
          <div className="stat-top">
            <span>Total Monthly Income</span>
            <span className="stat-icon green">↓</span>
          </div>
          <div className="stat-value">{formatRupee(summary.totalIncome)}</div>
          <div className="stat-foot">Recorded income entries</div>
        </div>

        <div className="stat-card expense-card">
          <div className="stat-top">
            <span>Total Expenses</span>
            <span className="stat-icon orange">◷</span>
          </div>
          <div className="stat-value">{formatRupee(summary.totalExpenses)}</div>
          <div className="stat-foot">Logged expenses & paid bills</div>
        </div>

        <div className="stat-card balance-card">
          <div className="stat-top">
            <span>Remaining Net Balance</span>
            <span className="stat-icon purple">◈</span>
          </div>
          <div className="stat-value">{formatRupee(summary.netBalance)}</div>
          <div className="stat-foot">
            {summary.netBalance >= 0 ? (
              <span className="positive">● Surplus balance</span>
            ) : (
              <span className="text-red">● Deficit balance</span>
            )}
          </div>
        </div>

        <div className="stat-card upcoming-card">
          <div className="stat-top">
            <span>Pending & Overdue Bills</span>
            <span className="stat-icon blue">⚡</span>
          </div>
          <div className="stat-value">{formatRupee(totalUpcomingAmount)}</div>
          <div className="stat-foot">{upcomingBills.length} pending bill(s)</div>
        </div>
      </div>

      {/* Main Grid: Bills & Calendar (Left) vs Income/Expense (Right) */}
      <div className="cashflow-main-grid">
        {/* LEFT COLUMN: Bills Calendar & Management */}
        <div className="panel bills-panel">
          <div className="panel-heading">
            <div>
              <h2>Bill Calendar & Schedules</h2>
              <p>Never miss a due date. Mark bills paid to update your cash flow.</p>
            </div>
            <button className="primary-button" onClick={handleOpenAddBill}>
              + Add Bill
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="calendar-widget">
            <div className="calendar-weekdays">
              <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
            </div>
            <div className="calendar-days-grid">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="calendar-day empty" />;
                const dayBills = getBillsForDay(day);
                const hasOverdue = dayBills.some((b) => b.status === 'overdue');
                const hasUnpaid = dayBills.some((b) => b.status === 'unpaid');
                const hasPaid = dayBills.some((b) => b.status === 'paid');

                return (
                  <div key={`day-${day}`} className={`calendar-day ${dayBills.length > 0 ? 'has-bills' : ''}`}>
                    <span className="day-number">{day}</span>
                    {dayBills.length > 0 && (
                      <div className="day-dots">
                        {hasOverdue && <span className="dot dot-red" title="Overdue Bill" />}
                        {hasUnpaid && <span className="dot dot-orange" title="Unpaid Bill" />}
                        {hasPaid && <span className="dot dot-green" title="Paid Bill" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bills List Table */}
          <div className="bills-list-section">
            <h3>Bills for {monthNames[selectedMonth - 1]}</h3>
            {bills.length === 0 ? (
              <div className="empty-state">No bills recorded for this period. Click "+ Add Bill" to schedule one.</div>
            ) : (
              <div className="table-wrapper">
                <table className="bills-table">
                  <thead>
                    <tr>
                      <th>Bill Name</th>
                      <th>Category</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bills.map((bill) => (
                      <tr key={bill._id}>
                        <td>
                          <strong>{bill.name}</strong>
                          <span className="sub-text">{bill.recurrence !== 'none' ? `Recurrence: ${bill.recurrence}` : 'One-time'}</span>
                        </td>
                        <td>{bill.category}</td>
                        <td>{new Date(bill.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                        <td><strong>{formatRupee(bill.amount)}</strong></td>
                        <td>
                          <span className={`status-badge status-${bill.status}`}>
                            {bill.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {bill.status !== 'paid' && (
                              <button
                                className="action-btn pay-btn"
                                title="Mark as Paid"
                                onClick={() => handlePayBill(bill._id)}
                              >
                                Pay ✓
                              </button>
                            )}
                            <button
                              className="action-btn edit-btn"
                              title="Edit Bill"
                              onClick={() => handleOpenEditBill(bill)}
                            >
                              ✎
                            </button>
                            <button
                              className="action-btn delete-btn"
                              title="Delete Bill"
                              onClick={() => handleDeleteBill(bill._id)}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Income, Expenses & Visualizations */}
        <div className="cashflow-right-column">
          {/* Income vs Expenses Visualizer */}
          <div className="panel visualizer-panel">
            <h2>Income vs Expenses Ratio</h2>
            <div className="income-expense-bar-wrapper">
              <div className="ratio-labels">
                <span className="text-green">Income: {formatRupee(summary.totalIncome)}</span>
                <span className="text-red">Expenses: {formatRupee(summary.totalExpenses)}</span>
              </div>
              <div className="ratio-progress-track">
                {summary.totalIncome > 0 ? (
                  <div
                    className="ratio-progress-fill green-fill"
                    style={{
                      width: `${Math.min(100, Math.round((summary.totalExpenses / summary.totalIncome) * 100))}%`,
                    }}
                  />
                ) : (
                  <div className="ratio-progress-fill green-fill" style={{ width: '0%' }} />
                )}
              </div>
              <p className="ratio-note">
                Spent {summary.totalIncome > 0 ? Math.round((summary.totalExpenses / summary.totalIncome) * 100) : 0}% of monthly income
              </p>
            </div>
          </div>

          {/* Expense Category Breakdown */}
          <div className="panel breakdown-panel">
            <h2>Expense Breakdown</h2>
            {Object.keys(summary.categoryBreakdown).length === 0 ? (
              <div className="empty-state">No expenses logged for this month.</div>
            ) : (
              <div className="category-list">
                {Object.entries(summary.categoryBreakdown).map(([cat, amt]) => {
                  const pct = summary.totalExpenses > 0 ? Math.round((amt / summary.totalExpenses) * 100) : 0;
                  return (
                    <div key={cat} className="category-row">
                      <div className="cat-info">
                        <span className="cat-name">{cat}</span>
                        <strong className="cat-amount">{formatRupee(amt)} ({pct}%)</strong>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill purple-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cash Flow Log / Transaction Log */}
          <div className="panel transactions-log-panel">
            <div className="panel-heading">
              <div>
                <h2>Income & Expense Log</h2>
                <p>Recent transactions</p>
              </div>
              <button className="primary-button" onClick={handleOpenAddCashFlow}>
                + Log Entry
              </button>
            </div>

            <div className="transaction-list">
              {entries.length === 0 ? (
                <div className="empty-state">No cash flow records found.</div>
              ) : (
                entries.map((entry) => (
                  <div key={entry._id} className="transaction-row">
                    <div className={`transaction-icon transaction-${entry.type}`}>
                      {entry.type === 'income' ? '↓' : '◷'}
                    </div>
                    <div className="transaction-name">
                      <strong>{entry.title}</strong>
                      <span>{entry.category} • {new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className={`transaction-amount ${entry.type === 'income' ? 'positive' : ''}`}>
                      {entry.type === 'income' ? '+' : '−'}{formatRupee(entry.amount)}
                    </div>
                    <button
                      className="log-delete-btn"
                      title="Delete Entry"
                      onClick={() => handleDeleteCashFlow(entry._id)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add/Edit Bill */}
      {showBillModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>{editingBill ? 'Edit Bill' : 'Schedule New Bill'}</h3>
            <form onSubmit={handleSaveBill} className="modal-form">
              <div className="form-group">
                <label>Bill Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electricity Bill, WiFi Rent"
                  value={billForm.name}
                  onChange={(e) => setBillForm({ ...billForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="e.g. 1500"
                  value={billForm.amount}
                  onChange={(e) => setBillForm({ ...billForm, amount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  required
                  value={billForm.dueDate}
                  onChange={(e) => setBillForm({ ...billForm, dueDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={billForm.category}
                  onChange={(e) => setBillForm({ ...billForm, category: e.target.value })}
                >
                  {BILL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Recurrence</label>
                <select
                  value={billForm.recurrence}
                  onChange={(e) => setBillForm({ ...billForm, recurrence: e.target.value })}
                >
                  <option value="none">One-time</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="text-button" onClick={() => setShowBillModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  {editingBill ? 'Update Bill' : 'Save Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Income / Expense Entry */}
      {showCashFlowModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Log Income or Expense</h3>
            <form onSubmit={handleSaveCashFlow} className="modal-form">
              <div className="form-group">
                <label>Entry Type</label>
                <div className="type-toggle-group">
                  <button
                    type="button"
                    className={`type-btn ${cashFlowForm.type === 'income' ? 'active-income' : ''}`}
                    onClick={() => setCashFlowForm({ ...cashFlowForm, type: 'income', category: 'Salary' })}
                  >
                    + Income
                  </button>
                  <button
                    type="button"
                    className={`type-btn ${cashFlowForm.type === 'expense' ? 'active-expense' : ''}`}
                    onClick={() => setCashFlowForm({ ...cashFlowForm, type: 'expense', category: 'Food & Essentials' })}
                  >
                    − Expense
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Title / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Monthly Salary, Grocery Shopping"
                  value={cashFlowForm.title}
                  onChange={(e) => setCashFlowForm({ ...cashFlowForm, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Amount (₹)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  required
                  placeholder="e.g. 5000"
                  value={cashFlowForm.amount}
                  onChange={(e) => setCashFlowForm({ ...cashFlowForm, amount: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={cashFlowForm.category}
                  onChange={(e) => setCashFlowForm({ ...cashFlowForm, category: e.target.value })}
                >
                  {CASHFLOW_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  required
                  value={cashFlowForm.date}
                  onChange={(e) => setCashFlowForm({ ...cashFlowForm, date: e.target.value })}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="text-button" onClick={() => setShowCashFlowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button">
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillsAndCashFlow;
