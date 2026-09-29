const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");
const { QUIZ_SEED_DATA } = require("../seeders/quizSeeder");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");

        // Ensure Quiz question bank is seeded in MongoDB
        const quizCount = await Quiz.countDocuments();
        if (quizCount < 3) {
            for (const quizData of QUIZ_SEED_DATA) {
                await Quiz.findOneAndUpdate(
                    { gameId: quizData.gameId },
                    quizData,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );
            }
            console.log("Quiz question bank seeded in MongoDB.");
        }
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;