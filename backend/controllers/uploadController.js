const fs = require("fs");
const csv = require("csv-parser");
const Transaction = require("../models/Transaction");

const controlUpload = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please Upload a File",
            });
        }

        const transactions = [];

        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (row) => {
                if (row.date && row.description && row.category && row.type && row.amount) {
                    transactions.push(row);
                }
                })
            .on("end", async () => {
                try {
                    const transactionData = transactions.map((row) => ({
                        userId: req.user,
                        date: row.date,
                        description: row.description,
                        category: row.category,
                        type: row.type,
                        amount: Number(row.amount),
                    }));
                    const savedTransactions =
                        await Transaction.insertMany(transactionData);
                    fs.unlink(req.file.path, (error) => {
                        if (error) {
                            console.error("Failed to delete uploaded file:", error);
                        }
                    });

                    return res.status(200).json({
                        success: true,
                        message: "Transactions saved successfully",
                        count: savedTransactions.length,
                    });
                } catch (error) {
                    console.error("Database error:", error);

                    return res.status(500).json({
                        success: false,
                        message: "Failed to save transactions",
                    });
                }
            })
            .on("error", (error) => {
                console.error("CSV error:", error);

                return res.status(500).json({
                    success: false,
                    message: "Failed to read CSV file",
                });
            });
    } catch (error) {
        console.error("Upload error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    controlUpload,
}; 