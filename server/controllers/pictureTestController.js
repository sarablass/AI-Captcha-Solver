const CaptchaModel = require("../models/pictureTestModel");

// שמירת נתונים של CAPTCHA
const saveCaptchaData = async (req, res) => {
  try {
    const { verified, token } = req.body;
    console.log(verified);
    console.log(token);
    console.log("Received data:", req.body);

    if (!verified || !token) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }
    console.log("after if");


    // יצירת מסמך חדש בבסיס הנתונים
    const newCaptcha = new CaptchaModel({
        verified,
        token,
    });

    // שמירה בבסיס הנתונים
    await newCaptcha.save();

    res
      .status(200)
      .json({ success: true, message: "Captcha data saved successfully" });
  } catch (error) {
    console.log("Error saving captcha data:", error);
    console.error("Error saving captcha data:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { saveCaptchaData };
