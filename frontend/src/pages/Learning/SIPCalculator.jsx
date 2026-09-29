import React, { useState, useEffect, useMemo } from 'react';
import { calculateSIP } from '../../services/sipService';
import './SIPCalculator.css';

const SIPCalculator = () => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState('standard'); // 'standard' | 'goal'

  // Input states
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [durationYears, setDurationYears] = useState(10);
  const [expectedReturnRate, setExpectedReturnRate] = useState(12);

  // Step-up SIP state
  const [stepUpEnabled, setStepUpEnabled] = useState(false);
  const [stepUpRate, setStepUpRate] = useState(10); // 5% or 10% only

  // Inflation adjustment state
  const [inflationEnabled, setInflationEnabled] = useState(false);
  const inflationRate = 6; // Illustrative 6% annual inflation assumption

  // Backend verification state
  const [, setApiStatus] = useState({ synced: true, error: '' });

  // Calculation Logic (Math exact calculation engine)
  const calculationResults = useMemo(() => {
    const durationMonths = durationYears * 12;
    const monthlyRate = expectedReturnRate / 12 / 100;
    const stepUp = stepUpEnabled ? stepUpRate / 100 : 0;

    let cumulativeInvested = 0;
    let portfolioValue = 0;

    const yearlyData = [
      {
        year: 0,
        invested: 0,
        value: 0,
        realValue: 0,
      },
    ];

    for (let m = 1; m <= durationMonths; m++) {
      const currentYear = Math.floor((m - 1) / 12) + 1;
      const currentMonthlyDeposit = monthlyAmount * Math.pow(1 + stepUp, currentYear - 1);

      cumulativeInvested += currentMonthlyDeposit;
      portfolioValue = (portfolioValue + currentMonthlyDeposit) * (1 + monthlyRate);

      if (m % 12 === 0) {
        const yearNum = m / 12;
        const inflationFactor = Math.pow(1 + inflationRate / 100, yearNum);
        const realVal = portfolioValue / inflationFactor;

        yearlyData.push({
          year: yearNum,
          invested: Math.round(cumulativeInvested),
          value: Math.round(portfolioValue),
          realValue: Math.round(realVal),
        });
      }
    }

    const finalTotalInvested = Math.round(cumulativeInvested);
    const finalEstimatedValue = Math.round(portfolioValue);
    const finalEstimatedReturns = Math.max(0, finalEstimatedValue - finalTotalInvested);
    const inflationFactor = Math.pow(1 + inflationRate / 100, durationYears);
    const finalRealValue = Math.round(finalEstimatedValue / inflationFactor);

    return {
      durationMonths,
      totalInvested: finalTotalInvested,
      estimatedValue: finalEstimatedValue,
      estimatedReturns: finalEstimatedReturns,
      realValue: finalRealValue,
      yearlyData,
    };
  }, [monthlyAmount, durationYears, expectedReturnRate, stepUpEnabled, stepUpRate, inflationRate]);

  // Sync with backend API for verification (debounce backend call)
  useEffect(() => {
    if (stepUpEnabled || inflationEnabled) {
      setApiStatus({ synced: true, error: '' });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await calculateSIP(monthlyAmount, durationYears * 12, expectedReturnRate);
        setApiStatus({ synced: true, error: '' });
      } catch (err) {
        setApiStatus({ synced: false, error: err.message || 'API sync failed' });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [monthlyAmount, durationYears, expectedReturnRate, stepUpEnabled, inflationEnabled]);

  const formatRupee = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const { totalInvested, estimatedValue, estimatedReturns, realValue, yearlyData } = calculationResults;

  const displayMaturityValue = inflationEnabled ? realValue : estimatedValue;
  const investedPercentage = Math.round((totalInvested / estimatedValue) * 100) || 0;
  const returnsPercentage = Math.max(0, 100 - investedPercentage);

  // SVG Chart path building
  const chartWidth = 560;
  const chartHeight = 180;
  const paddingX = 30;
  const paddingY = 25;

  const maxChartVal = Math.max(...yearlyData.map((d) => d.value), 1000);

  const pointsInvested = yearlyData.map((d, i) => {
    const x = paddingX + (i / (yearlyData.length - 1)) * (chartWidth - 2 * paddingX);
    const y = chartHeight - paddingY - (d.invested / maxChartVal) * (chartHeight - 2 * paddingY);
    return `${x},${y}`;
  });

  const pointsValue = yearlyData.map((d, i) => {
    const val = inflationEnabled ? d.realValue : d.value;
    const x = paddingX + (i / (yearlyData.length - 1)) * (chartWidth - 2 * paddingX);
    const y = chartHeight - paddingY - (val / maxChartVal) * (chartHeight - 2 * paddingY);
    return `${x},${y}`;
  });

  const pathValueLine = `M ${pointsValue.join(' L ')}`;
  const pathInvestedLine = `M ${pointsInvested.join(' L ')}`;

  const areaValuePath = `${pathValueLine} L ${chartWidth - paddingX},${chartHeight - paddingY} L ${paddingX},${chartHeight - paddingY} Z`;

  return (
    <div className="sip-wrapper">
      {/* Header & Tabs */}
      <div className="sip-page-header">
        <div className="sip-header-title">
          <span className="sip-badge">SIMULATOR</span>
          <h1>SIP Investment</h1>
          <p>
            Simulate how regular monthly investments grow over time through compound interest.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="sip-tab-toggle">
          <button
            className={`sip-tab-btn ${activeTab === 'standard' ? 'active' : ''}`}
            onClick={() => setActiveTab('standard')}
          >
            Standard SIP
          </button>
          <button
            className={`sip-tab-btn ${activeTab === 'goal' ? 'active' : ''}`}
            onClick={() => setActiveTab('goal')}
          >
            Goal Mode <span className="tab-badge">SOON</span>
          </button>
        </div>
      </div>

      {activeTab === 'goal' ? (
        /* Goal Mode UI Placeholder */
        <div className="sip-goal-placeholder">
          <div className="goal-placeholder-icon">🎯</div>
          <h3>Target-Based Goal Mode</h3>
          <p>
            Set your target savings amount (e.g. ₹5,00,000 for higher education or emergency fund)
            and calculate the exact monthly investment required to reach it.
          </p>
          <span className="goal-status-chip">Feature Preview • Coming Soon in next update</span>
          <button className="sip-tab-btn active" onClick={() => setActiveTab('standard')}>
            Return to Standard SIP Simulator
          </button>
        </div>
      ) : (
        /* Main Two-Column Simulator Layout */
        <div className="sip-simulator-grid">
          {/* LEFT COLUMN: Controls */}
          <div className="sip-card controls-card">
            <h2 className="card-title">Investment Inputs</h2>

            {/* Monthly Investment Slider & Display */}
            <div className="control-group">
              <div className="control-header">
                <label htmlFor="monthly-amount">Monthly Investment</label>
                <div className="input-value-display">
                  <span>₹</span>
                  <input
                    id="monthly-amount-input"
                    type="number"
                    min="500"
                    max="500000"
                    step="500"
                    value={monthlyAmount}
                    onChange={(e) => setMonthlyAmount(Math.max(0, Number(e.target.value)))}
                  />
                </div>
              </div>
              <input
                id="monthly-amount"
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="sip-slider"
              />
              <div className="slider-range-labels">
                <span>₹500</span>
                <span>₹50,000</span>
                <span>₹100,000</span>
              </div>
            </div>

            {/* Duration Slider & Display */}
            <div className="control-group">
              <div className="control-header">
                <label htmlFor="duration-years">Investment Duration</label>
                <div className="duration-pill">
                  <strong>{durationYears}</strong> {durationYears === 1 ? 'Year' : 'Years'} ({durationYears * 12} Mos)
                </div>
              </div>
              <input
                id="duration-years"
                type="range"
                min="1"
                max="30"
                step="1"
                value={durationYears}
                onChange={(e) => setDurationYears(Number(e.target.value))}
                className="sip-slider"
              />
              <div className="slider-range-labels">
                <span>1 Yr</span>
                <span>15 Yrs</span>
                <span>30 Yrs</span>
              </div>
            </div>

            {/* Expected Return Rate & Presets */}
            <div className="control-group">
              <div className="control-header">
                <label htmlFor="return-rate">Expected Annual Return Rate</label>
                <span className="rate-display">{expectedReturnRate}% p.a.</span>
              </div>

              {/* Preset Rate Buttons */}
              <div className="preset-buttons">
                {[7, 12, 15].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    className={`preset-btn ${expectedReturnRate === rate ? 'active' : ''}`}
                    onClick={() => setExpectedReturnRate(rate)}
                  >
                    {rate}%
                  </button>
                ))}
              </div>

              <input
                id="return-rate"
                type="range"
                min="1"
                max="30"
                step="0.5"
                value={expectedReturnRate}
                onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                className="sip-slider"
              />
              <p className="field-hint">Illustrative rate assumptions, not guaranteed returns.</p>
            </div>

            {/* Annual Step-up SIP Section */}
            <div className="toggle-section">
              <div className="toggle-header">
                <div>
                  <strong>Annual Step-up SIP</strong>
                  <p>Increase your monthly investment every year</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={stepUpEnabled}
                    onChange={(e) => setStepUpEnabled(e.target.checked)}
                  />
                  <span className="slider-round" />
                </label>
              </div>

              {stepUpEnabled && (
                <div className="toggle-content">
                  <label>Annual Increase Rate</label>
                  <div className="preset-buttons">
                    {[5, 10].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        className={`preset-btn ${stepUpRate === rate ? 'active' : ''}`}
                        onClick={() => setStepUpRate(rate)}
                      >
                        +{rate}% / year
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Inflation Adjustment Section */}
            <div className="toggle-section">
              <div className="toggle-header">
                <div>
                  <strong>Inflation Adjustment</strong>
                  <p>Show purchasing power in today's money (6% assumption)</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={inflationEnabled}
                    onChange={(e) => setInflationEnabled(e.target.checked)}
                  />
                  <span className="slider-round" />
                </label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Results & Visualizations */}
          <div className="sip-card results-card">
            {/* Prominent Projected Value Box */}
            <div className="maturity-highlight-box">
              <span className="highlight-label">
                {inflationEnabled ? "ESTIMATED PURCHASING POWER (IN TODAY'S RUPEES)" : "PROJECTED MATURITY VALUE"}
              </span>
              <div className="highlight-amount">{formatRupee(displayMaturityValue)}</div>
              {inflationEnabled && (
                <span className="inflation-tag">
                  Adjusted for 6% annual inflation • Nominal value: {formatRupee(estimatedValue)}
                </span>
              )}
            </div>

            {/* Metrics Breakdown Grid */}
            <div className="metrics-grid">
              <div className="metric-box">
                <span className="metric-title">Total Invested</span>
                <span className="metric-number">{formatRupee(totalInvested)}</span>
              </div>
              <div className="metric-box green-accent">
                <span className="metric-title">Estimated Returns</span>
                <span className="metric-number positive">+{formatRupee(estimatedReturns)}</span>
              </div>
            </div>

            {/* Donut Ring Chart */}
            <div className="ring-chart-section">
              <div
                className="conic-ring"
                style={{
                  background: `conic-gradient(#8068df 0% ${investedPercentage}%, #38a887 ${investedPercentage}% 100%)`,
                }}
              >
                <div className="ring-inner">
                  <strong>{returnsPercentage}%</strong>
                  <span>Returns</span>
                </div>
              </div>

              <div className="ring-legend">
                <div className="legend-row">
                  <span className="dot dot-purple" />
                  <span>Invested Amount:</span>
                  <strong>{formatRupee(totalInvested)} ({investedPercentage}%)</strong>
                </div>
                <div className="legend-row">
                  <span className="dot dot-green" />
                  <span>Est. Wealth Gain:</span>
                  <strong>{formatRupee(estimatedReturns)} ({returnsPercentage}%)</strong>
                </div>
              </div>
            </div>

            {/* Time-Series Growth SVG Chart */}
            <div className="chart-container">
              <div className="chart-header-row">
                <h3>Growth Projection Over Time</h3>
                <span className="chart-tag">EDUCATIONAL PROJECTION</span>
              </div>

              <div className="svg-chart-wrapper">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  preserveAspectRatio="none"
                  className="growth-svg-chart"
                >
                  <defs>
                    <linearGradient id="sipValueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8068df" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8068df" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="#f0eff5" strokeWidth="1" />
                  <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="#f0eff5" strokeWidth="1" />
                  <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="#eeeef4" strokeWidth="1" />

                  {/* Area fill under value curve */}
                  <path d={areaValuePath} fill="url(#sipValueFill)" />

                  {/* Invested Line */}
                  <path d={pathInvestedLine} fill="none" stroke="#a09eaf" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Value Line */}
                  <path d={pathValueLine} fill="none" stroke="#8068df" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <div className="chart-legend-row">
                <div className="chart-legend-item">
                  <span className="line-sample purple-sample" />
                  <span>Projected Value</span>
                </div>
                <div className="chart-legend-item">
                  <span className="line-sample dashed-sample" />
                  <span>Amount Invested</span>
                </div>
                <span className="chart-timeline-note">Year 0 to Year {durationYears}</span>
              </div>
            </div>

            {/* FinQuest Educational Insight Card */}
            <div className="insight-card">
              <div className="insight-icon">✦</div>
              <div className="insight-body">
                <strong>FinQuest Wealth Insight</strong>
                <p>
                  Your estimated returns contribute <strong>{formatRupee(estimatedReturns)}</strong> ({returnsPercentage}% of your total projected value) over this period. {durationYears >= 10 ? 'Compounding speeds up dramatically after 10 years!' : 'Consider extending your duration to see power of long-term compounding.'}
                </p>
              </div>
            </div>

            {/* Preserved Educational Disclaimer */}
            <div className="disclaimer-box">
              <p>
                <strong>Educational illustration only.</strong> Returns are not guaranteed and this is not a live investment quote.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SIPCalculator;
