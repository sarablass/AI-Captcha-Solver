const CaptchaResult = require("../models/captchaDataModel");

const saveCaptchaResult = async (req, res) => {
  const { filePath, prompt, geminiResponse, isCaptchaSuccessful } = req.body;

  if (
    filePath === null ||
    prompt === null ||
    geminiResponse === null ||
    isCaptchaSuccessful === null
  ) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const newResult = new CaptchaResult({
      filePath,
      prompt,
      geminiResponse,
      isCaptchaSuccessful,
    });

    await newResult.save();
    res
      .status(200)
      .json({ success: true, message: "Result saved successfully" });
  } catch (error) {
    console.error("Error saving result:", error);
    res.status(500).json({ success: false, message: "Error saving result" });
  }
};

module.exports = { saveCaptchaResult };
