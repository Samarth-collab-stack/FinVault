const express = require("express");

const router = express.Router();

const { getTransactions,deleteTransaction,updateTransaction } = require("../controllers/transactionController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/transactions", authMiddleware, getTransactions);
router.delete("/transactions/:id", authMiddleware,deleteTransaction);
router.put(
    "/transactions/:id",
    (req, res, next) => {
        next();
    },
    authMiddleware,
    updateTransaction
);
module.exports = router;