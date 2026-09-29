
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const stockRoutes = require("./routes/stockRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const coolOffRoutes = require("./routes/coolOffRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend
app.use(cors({
    origin: "http://localhost:5173"
}));

// Parse JSON requests
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "Backend is running" });
});

// Authentication routes
app.use("/api/auth", authRoutes);
//Wallet routes 
app.use("/api/wallet", walletRoutes);
//Stock routes
app.use("/api/stocks", stockRoutes);
//transaction routes
app.use("/api/transactions", transactionRoutes);
//Portfolio routes
app.use("/api/portfolio", portfolioRoutes);
// Expense tracking routes
app.use("/api/expenses", expenseRoutes);
//Cool off routes 
app.use("/api/cool-off", coolOffRoutes);


// Start server after database connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});