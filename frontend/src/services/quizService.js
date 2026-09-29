/**
 * Service to handle Learn & Play Quiz API interactions.
 */

export const getQuizGame = async (gameId) => {
  const response = await fetch(`/api/quiz/games/${gameId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch quiz game.');
  }

  return data;
};

export const submitQuiz = async (gameId, answers) => {
  const token = localStorage.getItem('finquest_token');

  const response = await fetch('/api/quiz/submit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ gameId, answers }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit quiz attempt.');
  }

  return data;
};

export const getUserQuizStats = async () => {
  const token = localStorage.getItem('finquest_token');

  if (!token) {
    return { totalPoints: 0, totalAttempts: 0, attempts: [] };
  }

  const response = await fetch('/api/quiz/stats', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch quiz stats.');
  }

  return data;
};
