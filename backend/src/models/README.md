## Backend Models

The backend models are divided according to the project responsibilities of Mansi and Seana. Shared files should be modified carefully and communicated with the other team member before making structural changes.

### Shared Models / Files

These are used by both members and should not be treated as individually owned files:

- `User.js` — Common user information and authentication-related data.
- `server.js` — Main Express server and application entry point.
- `config/db.js` — MongoDB Atlas connection.
- Authentication-related files — Shared between both modules.
- Common middleware and utilities — Shared when required by multiple modules.

> **Important:** Do not overwrite or make major changes to shared files without informing the other team member.

---

### Mansi's Models / Features

Mansi is responsible for the **Investment Learning/Game, BNPL/Debt Dashboard, and Bill Calendar + Cash Flow** modules.

#### Investment Learning/Game

- `SIP.js` — SIP simulation data.
- `MutualFund.js` — Mutual-fund simulation data.
- `Quiz.js` — Financial quiz data.
- `Game.js` — Investment mini-game data, if required.
- `Reward.js` / `Points.js` — Points and reward system, depending on the final implementation.
- `Streak.js` — User learning/activity streaks, if implemented separately.
- Leaderboard-related logic — Ranking users based on points/streaks.

#### BNPL / Debt Dashboard

- `Debt.js` — User debts, remaining amounts, payments, and exposure.
- Related controllers and routes for debt management.

#### Bill Calendar + Cash Flow

- `Bill.js` — Bills, due dates, amounts, and payment status.
- `Income.js` — Income records, if maintained separately.
- Related cash-flow calculations, controllers, and routes.

---

### Seana's Models / Features

Seana is responsible for the **Investment Simulation, Impulse Spending, and Cool-off Guardrail** modules.

#### Investment Simulation

- `Stock.js` — Simulated stock information and prices.
- `Portfolio.js` — User's simulated investment portfolio.
- `Transaction.js` — Buy/sell transaction history.
- `Wallet.js` — User's fake-money balance, if implemented as a separate model

## User Model — `src/models/User.js`

The `User` model defines the structure of a FinQuest user and determines what user information is stored in MongoDB.

### Current Fields

- **`name`** — Stores the user's name. It is required and automatically removes unnecessary spaces.
- **`email`** — Stores the user's email address. It is required, must be unique, and is converted to lowercase.
- **`password`** — Stores the user's password. It is required. Password hashing will be implemented later for security.
- **`role`** — Defines the user's access level:
  - `user` — Regular FinQuest user.
  - `admin` — Administrator with additional access.
- **`timestamps`** — Automatically adds `createdAt` and `updatedAt` fields to each user document.

### Purpose

The `User` model is shared across all FinQuest modules. Other models and features will reference the user when storing information such as investments, quizzes, points, debts, bills, and other user-specific data.

Feature-specific data is kept in separate models rather than being stored directly inside `User.js`.