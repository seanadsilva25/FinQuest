# FinQuest

FinQuest is a web-based financial learning and management platform designed to help users understand and practice better financial decision-making through interactive simulations, learning activities, and financial planning tools.

Instead of only displaying financial information, FinQuest allows users to explore different financial situations in a practical and engaging way.

---

## Features

### 1. Investment Learning & Games
- SIP simulation
- Mutual fund simulation
- Investment quizzes
- Financial mini-games
- Points and rewards
- Streaks and leaderboard
- Points can provide additional simulated investment money

### 2. Investment Simulation
- Fake-money investment wallet
- Simulated stock buying and selling
- Portfolio management
- Profit/loss tracking
- Transaction history
- Simulated stock prices

### 3. BNPL & Debt Dashboard
- Add and manage debts
- Track remaining amounts
- Upcoming payments
- Total debt exposure
- Income-ratio warnings

### 4. Bill Calendar & Cash Flow
- Add and track bills
- Track income
- Monthly/weekly bill calendar
- Weekly cash-flow view
- Tight-week detection
- Shortfall calculation
- Pre-saving suggestions

### 5. Impulse Spending
- Show the future financial impact of a purchase
- Show effect on savings/goals
- Suggest required adjustments or delays

### 6. Cool-off Guardrail
- Spending threshold detection
- 24-hour waiting period
- Countdown
- Cancel or proceed after the waiting period

---

## Tech Stack

### Frontend
- React
- Vite
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose
- MongoDB Atlas

---

## Project Structure

```text
FinQuest/
├── frontend/
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── SIP.js
│   │   │   └── ...
│   │   └── server.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
└── README.md