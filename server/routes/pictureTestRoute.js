const express = require("express");
const { saveCaptchaData } = require("../controllers/pictureTestController");

const router = express.Router();

// נתיב לשמירת המידע
router.post("/", saveCaptchaData);

module.exports = router;
