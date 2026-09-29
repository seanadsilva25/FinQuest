import React, { useState } from 'react';
import { calculateSIP } from '../../services/sipService';
import './SIPCalculator.css';

const SIPCalculator = () => {
  const [monthlyAmount, setMonthlyAmount] = useState('2000');
  const [durationMonths, setDurationMonths] = useState('60');
  const [expectedReturnRate, setExpectedReturnRate] = useState('12');

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side quick check
    const amount = Number(monthlyAmount);
    const duration = Number(durationMonths);
    const rate = Number(expectedReturnRate);

    if (isNaN(amount) || amount <= 0) {
      setError('Monthly investment must be greater than 0.');
      return;
    }
    if (isNaN(duration) || duration <= 0) {
      setError('Duration in months must be greater than 0.');
      return;
    }
    if (isNaN(rate) || rate < 0) {
      setError('Expected annual return rate cannot be negative.');
      return;
    }

    setLoading(true);
    try {
      const data = await calculateSIP(monthlyAmount, durationMonths, expectedReturnRate);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while calculating SIP.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (val === undefined || val === null) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="sip-calculator-container">
      <div className="sip-header">
        <h1>SIP Investment Calculator</h1>
        <p className="sip-subtitle">
          Learn how regular monthly investments grow over time through compound interest.
        </p>
      </div>

      <div className="sip-card">
        <form onSubmit={handleSubmit} className="sip-form">
          <div className="form-group">
            <label htmlFor="monthlyAmount">Monthly Investment (₹)</label>
            <input
              id="monthlyAmount"
              type="number"
              min="1"
              step="any"
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(e.target.value)}
              placeholder="e.g. 2000"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="durationMonths">Investment Duration (Months)</label>
            <input
              id="durationMonths"
              type="number"
              min="1"
              step="1"
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              placeholder="e.g. 60"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="expectedReturnRate">Expected Annual Return Rate (%)</label>
            <input
              id="expectedReturnRate"
              type="number"
              min="0"
              step="any"
              value={expectedReturnRate}
              onChange={(e) => setExpectedReturnRate(e.target.value)}
              placeholder="e.g. 12"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="calculate-btn" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate SIP'}
          </button>
        </form>

        {result && (
          <div className="sip-results">
            <h2>Investment Summary</h2>
            <div className="results-grid">
              <div className="result-item">
                <span className="result-label">Total Amount Invested</span>
                <span className="result-value">{formatCurrency(result.totalInvested)}</span>
              </div>

              <div className="result-item">
                <span className="result-label">Estimated Returns</span>
                <span className="result-value returns-value">
                  +{formatCurrency(result.estimatedReturns)}
                </span>
              </div>

              <div className="result-item highlight">
                <span className="result-label">Estimated Maturity Value</span>
                <span className="result-value maturity-value">
                  {formatCurrency(result.estimatedValue)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="disclaimer-box">
          <p>
            <strong>Disclaimer:</strong> Educational illustration only. Returns are not guaranteed
            and this is not a live investment quote.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
