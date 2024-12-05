const express = require("express");
const router = express.Router();
const {processImage} = require("../controllers/imageProcessingController");

// מסלול לעיבוד תמונה
router.post("/", processImage);

module.exports = router;
