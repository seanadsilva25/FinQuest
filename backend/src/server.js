require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const sipRoutes = require("./routes/sipRoutes");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const quizRoutes = require("./routes/quizRoutes");
const billRoutes = require("./routes/billRoutes");
const cashFlowRoutes = require("./routes/cashFlowRoutes");

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

// SIP routes
app.use("/api/sip", sipRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// Wallet routes
app.use("/api/wallet", walletRoutes);

// Quiz routes
app.use("/api/quiz", quizRoutes);

// Bill & Cash Flow routes
app.use("/api/bills", billRoutes);
app.use("/api/cashflow", cashFlowRoutes);

// Start server after database connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});