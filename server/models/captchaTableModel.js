const mongoose = require("mongoose");

const CaptchaResultSchema = new mongoose.Schema(
  {
    filePath: { type: String, required: true },
    prompt: { type: String, required: true },
    geminiResponse: { type: String, required: true },
    isCaptchaSuccessful: { type: Boolean, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("captcharesults", CaptchaResultSchema, "captcharesults");
