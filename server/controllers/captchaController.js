const axios = require("axios");
const Captcha = require("../models/captchaModel");

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// אימות CAPTCHA
const verifyCaptcha = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: "No token provided" });
  }

  try {
    // שליחת הטוקן ל-Google
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    const { success } = response.data;
    console.log("Controller");

    // שמירת תוצאה במסד הנתונים
    const captchaRecord = new Captcha({ token, verified: success });
    await captchaRecord.save();

    if (success) {
      return res.json({ success: true, message: "CAPTCHA verified successfully" });
    } else {
      return res.json({ success: false, message: "CAPTCHA verification failed" });
    }
  } catch (error) {
    console.error("Error verifying CAPTCHA:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
  
};
module.exports = { verifyCaptcha };
