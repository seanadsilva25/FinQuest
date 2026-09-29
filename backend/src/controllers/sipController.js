/**
 * SIP Calculation Controller
 * Calculates estimated returns for a Systematic Investment Plan (SIP) simulation
 * using monthly compounding.
 */

const calculateSIP = (req, res) => {
  try {
    const { monthlyAmount, durationMonths, expectedReturnRate } = req.body;

    // Validation
    const parsedMonthlyAmount = parseFloat(monthlyAmount);
    const parsedDurationMonths = parseInt(durationMonths, 10);
    const parsedExpectedReturnRate = parseFloat(expectedReturnRate);

    if (
      isNaN(parsedMonthlyAmount) ||
      isNaN(parsedDurationMonths) ||
      isNaN(parsedExpectedReturnRate)
    ) {
      return res.status(400).json({
        error: "Please provide valid numeric values for all input fields."
      });
    }

    if (parsedMonthlyAmount <= 0) {
      return res.status(400).json({
        error: "Monthly investment amount must be greater than 0."
      });
    }

    if (parsedDurationMonths <= 0) {
      return res.status(400).json({
        error: "Investment duration in months must be greater than 0."
      });
    }

    if (parsedExpectedReturnRate < 0) {
      return res.status(400).json({
        error: "Expected return rate cannot be negative."
      });
    }

    // Calculation logic (Monthly Compounding SIP Formula)
    // Formula: M = P * ({[1 + i]^n - 1} / i) * (1 + i)
    // where P = monthly investment, i = monthly interest rate, n = duration in months
    const monthlyRate = parsedExpectedReturnRate / 12 / 100;
    const totalInvested = parsedMonthlyAmount * parsedDurationMonths;

    let estimatedValue;

    if (monthlyRate === 0) {
      estimatedValue = totalInvested;
    } else {
      estimatedValue =
        parsedMonthlyAmount *
        ((Math.pow(1 + monthlyRate, parsedDurationMonths) - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    const estimatedReturns = estimatedValue - totalInvested;

    return res.status(200).json({
      monthlyAmount: parsedMonthlyAmount,
      durationMonths: parsedDurationMonths,
      expectedReturnRate: parsedExpectedReturnRate,
      totalInvested: Number(totalInvested.toFixed(2)),
      estimatedValue: Number(estimatedValue.toFixed(2)),
      estimatedReturns: Number(estimatedReturns.toFixed(2))
    });
  } catch (error) {
    return res.status(500).json({
      error: "An error occurred while calculating SIP simulation."
    });
  }
};

module.exports = {
  calculateSIP
};
