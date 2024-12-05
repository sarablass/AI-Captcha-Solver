const express = require("express");
const { verifyCaptcha } = require("../controllers/captchaController");

const router = express.Router();
// נתיב לאימות ה-CAPTCHA
router.post("/", verifyCaptcha);

module.exports = router;
