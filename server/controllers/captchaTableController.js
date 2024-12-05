const CaptchaTable = require("../models/captchaTableModel");

const getCaptchaResults = async (req, res) => {
  try {
    const results = await CaptchaTable.find().sort({ createdAt: -1 }); // מיון מהחדש לישן

    // עדכון `filePath` לנתיב נגיש לדפדפן
    const updatedResults = results.map((result) => ({
      ...result._doc, // כל השדות מהמסמך המקורי
      filePath: result.filePath ? result.filePath.replace(/\\/g, "/").replace(/^.*?screenshots/, "screenshots") : null, // אם filePath לא קיים, נשמור null
    }));

    res.status(200).json(updatedResults);
  } catch (error) {
    console.error("Failed to fetch captcha results:", error);
    res.status(500).json({ error: "Failed to fetch captcha results" });
  }
};

module.exports = { getCaptchaResults };
