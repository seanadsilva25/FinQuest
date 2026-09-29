/**
 * API service for Bill management endpoints
 */

const getAuthHeaders = () => {
  const token = localStorage.getItem('finquest_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getBills = async () => {
  const response = await fetch('/api/bills', {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch bills.');
  }
  return data.bills || [];
};

export const createBill = async (billData) => {
  const response = await fetch('/api/bills', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(billData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create bill.');
  }
  return data.bill;
};

export const updateBill = async (id, billData) => {
  const response = await fetch(`/api/bills/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(billData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update bill.');
  }
  return data.bill;
};

export const deleteBill = async (id) => {
  const response = await fetch(`/api/bills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete bill.');
  }
  return data;
};

export const markBillAsPaid = async (id) => {
  const response = await fetch(`/api/bills/${id}/pay`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to mark bill as paid.');
  }
  return data.bill;
};
