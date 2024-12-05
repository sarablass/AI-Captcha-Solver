//לא בשימוש!!!

const express = require("express");
const router = express.Router();
const { captureAndUpload } = require("../controllers/screenshotUploadController");

// נתיב לצילום מסך והעלאה ל-Gemini
router.post("/", captureAndUpload);

module.exports = router;