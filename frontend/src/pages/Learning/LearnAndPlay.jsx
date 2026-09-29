import React, { useState, useEffect } from 'react';
import QuizEngine from './QuizEngine';
import { getUserQuizStats } from '../../services/quizService';
import './LearnAndPlay.css';

const gamesList = [
  {
    id: 'pick_investment',
    title: 'Pick Better Investment',
    icon: '📈',
    tag: 'STRATEGY',
    description: 'Compare financial choices. Learn to evaluate risk, liquidity, and expense ratios.',
    questionsCount: 5,
    maxPoints: 100,
    colorClass: 'purple-card',
  },
  {
    id: 'spot_scam',
    title: 'Spot Scam',
    icon: '🛡️',
    tag: 'SECURITY',
    description: 'Identify red flags, phishing attempts, Ponzi schemes, and unverified tipsters.',
    questionsCount: 5,
    maxPoints: 100,
    colorClass: 'green-card',
  },
  {
    id: 'sip_challenge',
    title: 'SIP Challenge',
    icon: '🎯',
    tag: 'COMPOUNDING',
    description: 'Master Rupee Cost Averaging, Step-up SIPs, and long-term wealth growth.',
    questionsCount: 5,
    maxPoints: 100,
    colorClass: 'orange-card',
  },
];

const LearnAndPlay = () => {
  const [activeGameId, setActiveGameId] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getUserQuizStats();
      setTotalPoints(data.totalPoints || 0);
      setTotalAttempts(data.totalAttempts || 0);
    } catch (err) {
      console.error('Error fetching quiz stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleGameComplete = () => {
    fetchStats();
  };

  if (activeGameId) {
    return (
      <QuizEngine
        gameId={activeGameId}
        onBack={() => {
          setActiveGameId(null);
          fetchStats();
        }}
        onComplete={handleGameComplete}
      />
    );
  }

  return (
    <div className="learn-play-container">
      {/* Header Banner */}
      <div className="learn-header">
        <div>
          <span className="eyebrow">FINANCIAL SKILL GAMES</span>
          <h1>Learn & Play</h1>
          <p>Test your knowledge, spot scams, and master smart investing through interactive challenges.</p>
        </div>

        {/* User Stats Card */}
        <div className="user-score-chip">
          <div className="score-icon font-icon">🏆</div>
          <div className="score-text">
            <span className="score-label">QUEST POINTS EARNED</span>
            <strong className="score-value">
              {loadingStats ? '...' : `${totalPoints} Pts`}
            </strong>
          </div>
        </div>
      </div>

      {/* Mini-Games Grid */}
      <div className="games-grid">
        {gamesList.map((game) => (
          <div key={game.id} className={`game-card ${game.colorClass}`}>
            <div className="game-card-top">
              <div className="game-icon">{game.icon}</div>
              <span className="game-tag">{game.tag}</span>
            </div>

            <h2>{game.title}</h2>
            <p>{game.description}</p>

            <div className="game-card-footer">
              <div className="game-meta">
                <span>📝 {game.questionsCount} Questions</span>
                <span>⭐ Up to {game.maxPoints} Pts</span>
              </div>

              <button
                className="play-btn"
                onClick={() => setActiveGameId(game.id)}
              >
                Play Now →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Tip Box */}
      <div className="learn-tip-box">
        <div className="tip-icon">💡</div>
        <div>
          <strong>Why Play Mini-Games?</strong>
          <p>
            Real financial mistakes cost real money. Learning through risk-free interactive scenarios helps build intuitive decision-making skills before investing real capital.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LearnAndPlay;
