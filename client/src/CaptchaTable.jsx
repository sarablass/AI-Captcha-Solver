import React, { useEffect, useState } from "react";
import axios from "axios";
import NavigationMenu from "./NavigationMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box
} from "@mui/material";

const CaptchaTable = () => {
  const [captchaResults, setCaptchaResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [geminiAnalysis, setGeminiAnalysis] = useState(null); // אחסון תוצאות מג'מיני

  useEffect(() => {
    const fetchCaptchaResults = async () => {
      try {
        const response = await axios.get("http://localhost:5000/captchaTable");
        console.log(response.data);
        setCaptchaResults(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch captcha results");
        setLoading(false);
      }
    };
    fetchCaptchaResults();
    console.log(captchaResults);
  }, []);

  useEffect(() => {
    const analyzeResults = async () => {
      try {
        const analysis = await sendDataToGemini(captchaResults);
        setGeminiAnalysis(analysis?.data || null); // שמירה של תוצאות הניתוח
      } catch (error) {
        console.error("Error analyzing results:", error);
      }
    };

    if (captchaResults.length > 0) {
      analyzeResults();
    }
  }, [captchaResults]);

  const sendDataToGemini = async (captchaResults) => {
    try {
      // בדיקה אם captchaResults קיים ומכיל נתונים
      if (!captchaResults || captchaResults.length === 0) {
        console.error("No captcha results available for analysis.");
        return null; // או אפשר להחזיר הודעה אחרת
      }

      // חילוץ רק הערכים הבוליאניים מ-captchaResults
      const successData = captchaResults.map((result) => result.isCaptchaSuccessful);

      const prompt = `
      Analyze the following dataset, which contains boolean values indicating success (true) or failure (false).
      Calculate and return only the percentage of successes and the percentage of failures, without explaining the method.
    
      Data: ${JSON.stringify(successData)}
    `;

      const response = await axios.post("http://localhost:5000/analyzeData", {
        successData,
        prompt,
      });

      console.log("Gemini Analysis Result:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending data to Gemini:", error);
      throw error;
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <NavigationMenu />
      <div
        style={{
          marginTop: "80px",
          padding: "10px",
          overflowX: "auto", // פתרון לגלילה בטבלאות גדולות
        }}
      >
        {/* אחוזי הצלחה וכישלון */}
        {geminiAnalysis && (
          <Box
            sx={{
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#f5f5f5",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              textAlign: "center", // מיקום טקסט במרכז
            }}
          >
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            <Typography variant="body1">
              {geminiAnalysis}
            </Typography>
          </Box>
        )}
        <TableContainer
          component={Paper}
          style={{
            marginTop: "20px",
            maxWidth: "100%",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "8px",
          }}
        >
          <Table
            style={{
              tableLayout: "fixed", // פריסה קבועה לעמודות
              width: "100%",
            }}
          >
            <TableHead style={{ backgroundColor: "#5b9efc" }}>
              <TableRow>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "10%",
                  }}
                >
                  Date
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "15%",
                  }}
                >
                  Image
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "25%",
                  }}
                >
                  Prompt
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "25%",
                  }}
                >
                  Gemini Response
                </TableCell>
                <TableCell
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                    width: "15%",
                  }}
                >
                  Captcha Success
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {captchaResults.map((result) => (
                <TableRow key={result._id}>
                  <TableCell
                    style={{
                      verticalAlign: "top",
                      textAlign: "left",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(result.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell style={{ textAlign: "center" }}>
                    <img
                      src={`http://localhost:5000/${result.filePath}`}
                      alt="Captcha"
                      style={{
                        maxWidth: "180px",
                        height: "auto",
                        borderRadius: "8px",
                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      verticalAlign: "top",
                      textAlign: "left",
                    }}
                  >
                    {result.prompt}
                  </TableCell>
                  <TableCell
                    style={{
                      whiteSpace: "normal",
                      wordWrap: "break-word",
                      verticalAlign: "top",
                      textAlign: "left",
                    }}
                  >
                    {result.geminiResponse}
                  </TableCell>
                  <TableCell style={{ textAlign: "center", verticalAlign: "top" }}>
                    <Chip
                      label={result.isCaptchaSuccessful ? "Success" : "Failed"}
                      color={result.isCaptchaSuccessful ? "success" : "error"}
                      style={{ fontWeight: "bold" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </div>
    </>
  );
};

export default CaptchaTable;
