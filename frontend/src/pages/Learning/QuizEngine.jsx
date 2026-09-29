import React, { useState, useEffect } from 'react';
import { getQuizGame, submitQuiz } from '../../services/quizService';
import './QuizEngine.css';

const QuizEngine = ({ gameId, onBack, onComplete }) => {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Game state
  const [step, setStep] = useState('instructions'); // 'instructions' | 'question' | 'results'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState([null, null, null, null, null]);
  const [submitting, setSubmitting] = useState(false);

  // Result payload from server
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    const fetchGameData = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getQuizGame(gameId);
        setGame(data);
        setUserAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        setError(err.message || 'Failed to load quiz game.');
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [gameId]);

  const handleSelectOption = (optIdx) => {
    const updated = [...userAnswers];
    updated[currentIdx] = optIdx;
    setUserAnswers(updated);
  };

  const handleNextQuestion = () => {
    if (userAnswers[currentIdx] === null) return;

    if (currentIdx < game.questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevQuestion = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setError('');
    try {
      const result = await submitQuiz(gameId, userAnswers);
      setQuizResult(result);
      setStep('results');
      if (onComplete) onComplete(result);
    } catch (err) {
      setError(err.message || 'Failed to submit quiz.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setUserAnswers(new Array(game.questions.length).fill(null));
    setCurrentIdx(0);
    setQuizResult(null);
    setStep('instructions');
  };

  if (loading) {
    return (
      <div className="quiz-container loading-container">
        <div className="quiz-spinner">🎮</div>
        <p>Loading quiz game...</p>
      </div>
    );
  }

  if (error && !game) {
    return (
      <div className="quiz-container error-container">
        <h2>Oops! Game Unavailable</h2>
        <p>{error}</p>
        <button className="primary-button" onClick={onBack}>
          Back to Learn & Play
        </button>
      </div>
    );
  }

  const currentQ = game.questions[currentIdx];

  return (
    <div className="quiz-container">
      {/* Top Header */}
      <div className="quiz-top-nav">
        <button className="back-btn" onClick={onBack}>
          ← Back to Games
        </button>
        <div className="game-title-chip">
          <span>{game.icon}</span> {game.title}
        </div>
      </div>

      {/* Step 1: Instructions View */}
      {step === 'instructions' && (
        <div className="quiz-card instructions-card">
          <div className="instructions-icon">{game.icon}</div>
          <h1>{game.title}</h1>
          <p className="game-desc">{game.description}</p>

          <div className="instructions-box">
            <h3>How to Play</h3>
            <p>{game.instructions}</p>
            <ul>
              <li>5 Multiple Choice scenarios to test your financial knowledge.</li>
              <li>Select your choice for each question.</li>
              <li>Submit to receive your score, points earned, and detailed explanations.</li>
            </ul>
          </div>

          <button
            className="primary-button start-game-btn"
            onClick={() => setStep('question')}
          >
            Start Challenge 🚀
          </button>
        </div>
      )}

      {/* Step 2: Question View */}
      {step === 'question' && (
        <div className="quiz-card question-card">
          {/* Progress Header */}
          <div className="question-progress-bar">
            <div className="progress-info">
              <span>Question {currentIdx + 1} of {game.questions.length}</span>
              <span>{Math.round(((currentIdx + 1) / game.questions.length) * 100)}% Completed</span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${((currentIdx + 1) / game.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <h2 className="question-text">{currentQ.question}</h2>

          {/* MCQ Options */}
          <div className="options-grid">
            {currentQ.options.map((optionText, optIdx) => {
              const isSelected = userAnswers[currentIdx] === optIdx;
              return (
                <button
                  key={optIdx}
                  className={`option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectOption(optIdx)}
                >
                  <span className="option-indicator">{String.fromCharCode(65 + optIdx)}</span>
                  <span className="option-text">{optionText}</span>
                </button>
              );
            })}
          </div>

          {error && <div className="error-message">{error}</div>}

          {/* Action Footer */}
          <div className="question-actions">
            <button
              className="text-button"
              disabled={currentIdx === 0}
              onClick={handlePrevQuestion}
            >
              ← Previous
            </button>

            <button
              className="primary-button"
              disabled={userAnswers[currentIdx] === null || submitting}
              onClick={handleNextQuestion}
            >
              {submitting
                ? 'Submitting...'
                : currentIdx === game.questions.length - 1
                ? 'Finish Quiz →'
                : 'Next Question →'}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Server Evaluated Results & Explanations */}
      {step === 'results' && quizResult && (
        <div className="quiz-card results-card">
          <div className="results-header-box">
            <span className="results-badge">CHALLENGE COMPLETED</span>
            <h2>{game.title} Results</h2>
            <div className="score-metric-row">
              <div className="score-box">
                <span className="metric-label">Final Score</span>
                <span className="metric-val">{quizResult.score} / {quizResult.totalQuestions}</span>
              </div>
              <div className="score-box points-box">
                <span className="metric-label">Points Earned</span>
                <span className="metric-val positive">+{quizResult.pointsEarned} Pts</span>
              </div>
            </div>
          </div>

          {/* Question by Question Explanation Breakdown */}
          <div className="explanations-section">
            <h3>Question Breakdown & Explanations</h3>

            <div className="results-list">
              {quizResult.results.map((res, idx) => (
                <div
                  key={res.questionId}
                  className={`result-item-card ${res.isCorrect ? 'correct-item' : 'incorrect-item'}`}
                >
                  <div className="result-item-header">
                    <span className={`status-badge ${res.isCorrect ? 'bg-green' : 'bg-red'}`}>
                      {res.isCorrect ? '✓ Correct (+20 Pts)' : '✗ Incorrect (0 Pts)'}
                    </span>
                    <span className="q-number">Q{idx + 1}</span>
                  </div>

                  <p className="res-q-text">{res.question}</p>

                  <div className="answers-comparison">
                    <div className="choice-row">
                      <span>Your Choice:</span>
                      <strong className={res.isCorrect ? 'text-green' : 'text-red'}>
                        {res.options[res.userAnswer]}
                      </strong>
                    </div>

                    {!res.isCorrect && (
                      <div className="choice-row">
                        <span>Correct Answer:</span>
                        <strong className="text-green">{res.options[res.correctAnswer]}</strong>
                      </div>
                    )}
                  </div>

                  <div className="explanation-box">
                    <strong>Educational Explanation:</strong>
                    <p>{res.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="results-actions">
            <button className="text-button" onClick={handleRestart}>
              🔄 Try Again
            </button>
            <button className="primary-button" onClick={onBack}>
              Explore More Games →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizEngine;
