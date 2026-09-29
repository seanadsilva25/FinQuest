
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        amount: {
            type: Number,
            required: true,
            min: [0.01, "Amount must be greater than zero"]
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Food",
                "Shopping",
                "Entertainment",
                "Travel",
                "Bills",
                "Health",
                "Education",
                "Other"
            ]
        },

        description: {
            type: String,
            trim: true,
            maxlength: 200,
            default: ""
        },

        type: {
            type: String,
            enum: ["Planned", "Impulse"],
            required: true,
            default: "Planned"
        },

        trigger: {
            type: String,
            trim: true,
            maxlength: 200,
            default: ""
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Expense", expenseSchema);