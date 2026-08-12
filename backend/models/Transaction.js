const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        trim: true,
        lowercase: true,
    },
    type: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
        lowercase: true,
        trim: true,
    },
},
    {
        timestamps: true,
    }
);
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;