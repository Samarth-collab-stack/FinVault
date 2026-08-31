const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const Transaction = require("../models/Transaction");

const categorizeTransaction = (description) => {
    const text = description.toLowerCase();

    if (
        text.includes("swiggy") ||
        text.includes("zomato") ||
        text.includes("restaurant") ||
        text.includes("food")
    ) {
        return "food";
    }

    if (
        text.includes("amazon") ||
        text.includes("flipkart") ||
        text.includes("myntra") ||
        text.includes("shopping")
    ) {
        return "shopping";
    }

    if (
        text.includes("uber") ||
        text.includes("ola") ||
        text.includes("rapido") ||
        text.includes("transport")
    ) {
        return "transport";
    }

    if (
        text.includes("salary") ||
        text.includes("freelance") ||
        text.includes("stipend")
    ) {
        return "career";
    }

    return "other";
};

const controlUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please upload a PDF file",
            });
        }

        const fileBuffer = fs.readFileSync(req.file.path);

        const parser = new PDFParse({
            data: fileBuffer,
        });

        const pdfData = await parser.getText();

        const text = pdfData.text;

        await parser.destroy();
        console.log("Extracted PDF text:");
        console.log(text);

        const lines = text
            .split("\n")
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        const transactions = [];

        for (const line of lines) {
            const match = line.match(
                /^(\d{2}[\/-]\d{2}[\/-]\d{4})\s+(.+?)\s+([\d,]+(?:\.\d{2})?)\s+(credit|debit)$/i
            );

            if (!match) {
                continue;
            }

            const [, date, description, amount, type] = match;

            const parsedDate = date.replace(
                /(\d{2})[\/-](\d{2})[\/-](\d{4})/,
                "$3-$2-$1"
            );

            transactions.push({
                userId: req.user,
                date: new Date(parsedDate),
                description: description.trim(),
                category: categorizeTransaction(description),
                type: type.toLowerCase(),
                amount: Number(amount.replace(/,/g, "")),
            });
        }

        if (transactions.length === 0) {
            fs.unlink(req.file.path, () => { });

            return res.status(400).json({
                success: false,
                message:
                    "No valid transactions could be extracted from the PDF.",
            });
        }

        const savedTransactions =
            await Transaction.insertMany(transactions);

        fs.unlink(req.file.path, (error) => {
            if (error) {
                console.error(
                    "Failed to delete uploaded file:",
                    error
                );
            }
        });

        return res.status(200).json({
            success: true,
            message: "Bank statement processed successfully",
            count: savedTransactions.length,
        });

    } catch (error) {
        console.error("PDF upload error:", error);

        if (req.file?.path) {
            fs.unlink(req.file.path, () => { });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to process bank statement PDF",
        });
    }
};

module.exports = {
    controlUpload,
};