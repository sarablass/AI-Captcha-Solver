const mongoose = require("mongoose");

const captchaSchema = new mongoose.Schema({
    captchaToken: {
      type: Boolean,
      required: true,
    },
    timestamp: {
      type: String,
      required: true,
    },
  });

// שימוש במודל קיים אם הוא כבר מוגדר
const Captcha = mongoose.models.Captcha || mongoose.model("Captcha", captchaSchema);

module.exports = Captcha;
