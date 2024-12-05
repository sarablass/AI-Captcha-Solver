const express = require("express");
const router = express.Router();
const {analyzeDataController} = require("../controllers/analyzeDataController");

// מסלול לעיבוד תמונה
router.post("/", analyzeDataController);

module.exports = router;
