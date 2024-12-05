const { analyzeDataWithGemini } = require("../geminiApi");

const analyzeDataController = async (req, res) => {
  try {
    const { successData, prompt } = req.body;

    // שליחה לג'מיני
    const geminiResponse = await analyzeDataWithGemini(successData, prompt);

    // החזרת תוצאה ללקוח
    res.status(200).json({ success: true, data: geminiResponse });
  } catch (error) {
    console.error("Error processing data with Gemini API:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze data with Gemini API.",
    });
  }
};

module.exports = { analyzeDataController };
