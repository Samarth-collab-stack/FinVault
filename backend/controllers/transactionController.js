const Transaction = require("../models/Transaction");

const getTransactions = async (req,res) => {
    try{
        const transactions = await Transaction.find({
            userId: req.user,
        });
        return res.status(200).json({
            success:true,
            transactions,
        });
    } catch(error){
        console.error("Transaction fetch error:",error);

        return res.status(500).json({
            success: false,
            message: "failed to fetch transactions",
        });
    }
};

module.exports = {
    getTransactions,
};