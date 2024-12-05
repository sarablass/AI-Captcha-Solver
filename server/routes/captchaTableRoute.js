const express = require("express");
const router = express.Router();
const { getCaptchaResults } = require("../controllers/captchaTableController");

// נתיב לשליפת כל התוצאות
router.get("/", getCaptchaResults);

module.exports = router;
