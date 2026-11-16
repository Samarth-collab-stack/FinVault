const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadmiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { controlUpload } = require("../controllers/uploadController");

router.post(
    "/",
    authMiddleware,
    upload.single("file"),
    controlUpload
);

module.exports = router;