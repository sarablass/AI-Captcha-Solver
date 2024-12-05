const express = require("express");
const router = express.Router();
const { saveCaptchaResult } = require("../controllers/captchaDataController");

router.post("/", saveCaptchaResult);

module.exports = router;
