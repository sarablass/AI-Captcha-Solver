const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/db");

// חיבור למסד נתונים
connectDB();

// ייבוא הנתיבים
const captchaRoute = require("./routes/captchaRoute");
const pictureTestRoute = require("./routes/pictureTestRoute");
const screenshotUploadRoute = require("./routes/screenshotUploadRoute");
const imageProcessingRoute = require("./routes/imageProcessingRoute");
const captchaData = require("./routes/captchaDataRoute")
const captchaTableRoute = require("./routes/captchaTableRoute")
const analyzeData = require("./routes/analyzeDataRoute")

const app = express();

// הגדרות בינאריות
app.use(cors());
app.use(bodyParser.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
const path = require("path");



//שמירת נתונים חלקיים לשם בדטה בייס
app.use("/pictureTest", pictureTestRoute);
//שליחת תמונה ופרומפט לג'מיני
app.use("/analyzeCaptcha", imageProcessingRoute);
//שמירת נתונים מלאים בדטה בייס
app.use("/captchaData", captchaData)
//צילום על ידי השרת
app.use("/screenshot", screenshotUploadRoute);
app.use("/captchaTable", captchaTableRoute);
app.use("/screenshots", express.static(path.join(__dirname, "screenshots")));
app.use("/analyzeData", analyzeData);





// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
