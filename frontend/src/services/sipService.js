/**
 * Service to handle SIP API interactions.
 */

export const calculateSIP = async (monthlyAmount, durationMonths, expectedReturnRate) => {
  const response = await fetch('/api/sip/calculate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      monthlyAmount: Number(monthlyAmount),
      durationMonths: Number(durationMonths),
      expectedReturnRate: Number(expectedReturnRate),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to calculate SIP simulation.');
  }

  return data;
};
