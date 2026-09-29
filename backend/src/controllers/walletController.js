
const Wallet = require("../models/Wallet");

// Get the logged-in user's wallet
const getWallet = async (req, res) => {
    try {
        let wallet = await Wallet.findOne({ userId: req.user.id });

        // Create a wallet if the user doesn't have one
        if (!wallet) {
            wallet = await Wallet.create({
                userId: req.user.id,
                balance: 10000
            });
        }

        res.status(200).json({
            message: "Wallet fetched successfully",
            wallet
        });

    } catch (error) {
        console.error("Get wallet error:", error);
        res.status(500).json({
            message: "Server error while fetching wallet"
        });
    }
};

module.exports = { getWallet };

// Checks whether the logged-in user already has a wallet.

// If a wallet exists, it retrieves the saved balance.

// If no wallet exists, it creates one with a starting balance of ₹10,000.

// Saves the wallet in MongoDB Atlas.

// The wallet is associated with the logged-in user's ID, so different users have separate balances.
 