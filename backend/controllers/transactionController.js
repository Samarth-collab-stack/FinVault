const Transaction = require("../models/Transaction");

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            userId: req.user,
        });
        return res.status(200).json({
            success: true,
            transactions,
        });
    } catch (error) {
        console.error("Transaction fetch error:", error);

        return res.status(500).json({
            success: false,
            message: "failed to fetch transactions",
        });
    }
};
const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            userId: req.user,
        });
        if (!deletedTransaction) {
            return res.status(404).json({
                success: false,
                message: "transaction not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "transaction deleted sucessfully",
        });
    }
    catch (error) {
        console.error("Unable to delete transactions ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete transaction",
        });
    }
};
const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user,
            },
            {
                description: req.body.description,
                category: req.body.category,
                type: req.body.type,
                amount: req.body.amount,
            },
            {
                new: true,
                runValidators: true,
            }
        );
        if (!updatedTransaction) {
            return res.status(404).json({
                success: false,
                message: "transaction not Found",
            });
        }
        return res.status(200).json({
            success:true,
            message:"Transaction Updated Successfully",
            transaction: updatedTransaction,
        })
    }
    catch (error) {
        console.error("Failed To Update Transactions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to Update Transaction",
        })
    }
};
module.exports = {
    getTransactions,
    deleteTransaction,
    updateTransaction,
};