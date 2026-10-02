# FinQuest – Gen Z Financial Literacy & Personal Finance Platform

FinQuest is a full-stack financial literacy application designed for Gen Z, combining financial education, gamified learning, investment simulation, spending awareness, and everyday money management.

## Features

### Investment Simulation

* Browse simulated stocks and prices.
* Buy and sell stocks using virtual funds.
* Track portfolio holdings and investment value.
* View buy/sell transaction history.

### Virtual Wallet

* Provides users with simulated funds for investment activities.
* Balance updates automatically when stocks are bought or sold.
* Supports eligible learning rewards.
* Wallets are stored per user in MongoDB.

### Learn & Play

Three financial learning games:

* **Pick Better Investment**
* **Spot Scam**
* **SIP Challenge**

Each game includes MCQs, scoring, explanations, and reward points.

### Cool-Off Guard

* Introduces a 24-hour waiting period before an impulse purchase.
* Allows users to make a final **Buy** or **Avoid** decision.
* Records purchase decisions to encourage spending awareness.
  

### Bill Calendar & Cash Flow

* Add and manage bills with due dates, categories, and recurrence.
* View upcoming, paid, and overdue bills on a monthly calendar.
* Track income and expenses.
* View monthly balance and expense categories.

### SIP Investment Learning

* Calculate estimated SIP maturity value and returns.
* Compare total invested amount with estimated returns.
* Adjust monthly investment, duration, and expected return.

## Tech Stack

**Frontend:** React, Vite, CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB, Mongoose
**Authentication:** JWT
**Communication:** REST APIs

## Project Structure

```text
FinQuest/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── services/
│
└── README.md
```

## Screenshots

### Investment Simulation

<img width="602" height="270" alt="image" src="https://github.com/user-attachments/assets/a3798306-745f-430b-9310-443e48dcae5b" />
<img width="940" height="297" alt="image" src="https://github.com/user-attachments/assets/7c460d49-88b3-4818-8325-bc394abec76a" />


### Virtual Wallet

<img width="940" height="401" alt="image" src="https://github.com/user-attachments/assets/44d85e1e-0f32-4372-baa9-d0b9f347c833" />


### Learn & Play

<img width="940" height="350" alt="image" src="https://github.com/user-attachments/assets/59a2101b-4277-44b0-804c-3a2867346a99" />
<img width="413" height="540" alt="image" src="https://github.com/user-attachments/assets/bad82724-235f-4275-9372-0e2aa3525d2a" />

### Cool-Off Guard

<img width="888" height="442" alt="image" src="https://github.com/user-attachments/assets/76193f17-143a-4649-9986-b6c63fe2599c" />


### Bill Calendar & Cash Flow

<img width="940" height="736" alt="image" src="https://github.com/user-attachments/assets/c6f6500d-2b7c-43c1-9c61-2af9cdb2c5a6" />


### SIP Investment Learning

<img width="744" height="569" alt="image" src="https://github.com/user-attachments/assets/68af7c89-44c4-4d27-9c19-7822b19a7c79" />

