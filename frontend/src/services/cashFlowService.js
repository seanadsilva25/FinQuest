/**
 * API service for Cash Flow (Income & Expense) endpoints
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem('finquest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getCashFlowEntries = async () => {
  const response = await fetch('/api/cashflow', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cash flow entries.');
  }
  return data.entries || [];
};

export const createCashFlowEntry = async (entryData) => {
  const response = await fetch('/api/cashflow', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(entryData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create cash flow entry.');
  }
  return data.entry;
};

export const deleteCashFlowEntry = async (id) => {
  const response = await fetch(`/api/cashflow/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete cash flow entry.');
  }
  return data;
};

export const getCashFlowSummary = async (month, year) => {
  let url = '/api/cashflow/summary';
  if (month && year) {
    url += `?month=${month}&year=${year}`;
  }
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cash flow summary.');
  }
  return data.summary || { totalIncome: 0, totalExpenses: 0, netBalance: 0, categoryBreakdown: {} };
};
