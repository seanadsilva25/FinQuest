require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const sipRoutes = require("./routes/sipRoutes");
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");

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

// Start server after database connection
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
});