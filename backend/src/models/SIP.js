const mongoose = require("mongoose");

const sipSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        monthlyAmount: {
            type: Number,
            required: true,
            min: 1
        },

        durationMonths: {
            type: Number,
            required: true,
            min: 1
        },

        expectedReturnRate: {
            type: Number,
            required: true,
            min: 0
        },

        totalInvested: {
            type: Number,
            default: 0
        },

        estimatedValue: {
            type: Number,
            default: 0
        },

        startDate: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

const SIP = mongoose.model("SIP", sipSchema);

module.exports = SIP;