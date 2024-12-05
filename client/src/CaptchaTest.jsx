import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom"; 
import NavigationMenu from "./NavigationMenu";
import axios from "axios";
import { Box, Typography, Button, CircularProgress, TextField, Radio, RadioGroup, FormControlLabel, Paper } from "@mui/material";

const CaptchaTest = () => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("1");
  const [verificationResult, setVerificationResult] = useState("");
  const [buttonClickCount, setButtonClickCount] = useState(0); 
  const [buttonState, setButtonState] = useState(0); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [prompt, setPrompt] = useState(  `
    The image is divided into squares, either 9 (3x3) or 16 (4x4), numbered from top-left to bottom-right. The numbering starts at 1 and proceeds row by row.
    
    Your task:
    1. Describe the content of each square briefly, like "tree", "road", "car".
    2. Identify all squares containing the target object (e.g., "traffic lights"), even if it is only partially visible.
    3. Clearly list the numbers of the squares to select.
    
    Answer in this exact format:
    Descriptions:
    Square 1: [description]
    Square 2: [description]
    ... (continue for all squares)
    
    Select: [list of square numbers containing the object]
    If the object is not present in any square, respond with: "No squares to select."
    `);
  const [geminiResponse, setGeminiResponse] = useState(null); 
  const [isCaptchaSuccessful, setIsCaptchaSuccessful] = useState(null); 
  const navigate = useNavigate(); 

//prompt = "There are nine or sixteen squares arranged in rows. Number the squares from top to bottom, left to right, starting from 1. Explain what is in each square and specify which squares contain the item that appears after the words 'Select all the images of'. Finally, tell us which squares to select."
//prompt1 = "The image is divided into 9 or 16 squares. You need to: 1. Number the squares from left to right and top to bottom, with the top-left square being number 1. 2. Provide an accurate description of what is in each square, including small details such as partial objects or background elements (e.g., part of a traffic light pole, clouds, road). 3. Identify all squares that contain the item specified in the instruction (e.g., traffic lights or crosswalks), even if the item appears partially. 4. Clearly list the numbers of the squares to select. Use a clear response format such as: Square 1: road. Square 2: tree. Square 3: traffic light. Select squares: 3, 5, 7. If the item is not present in any square, state: No squares to select."
// const prompt =
      //   "There are squares in the image. Number the squares from left to right, top to bottom, and explain what is in each square. Then, identify which squares to select and tell me which numbered squares to choose.";
      //   const prompt = "There are nine or sixteen squres, explain what in each squre, and in which squre there is what the captcha asks to select";
      // setPrompt(
      //   "There are nine or sixteen squares arranged in rows. Number the squares from top to bottom, left to right, starting from 1. Explain what is in each square and specify which squares contain the item that appears after the words 'Select all the images of'. Finally, tell us which squares to select."
      // );

// Google reCAPTCHA Site Key 
  const RECAPTCHA_SITE_KEY = "6LfdW4QqAAAAADVsDtxwmOhFo3j9LI1oLeEvmbvb";

  // Using useEffect for filePath
  useEffect(() => {
    if (filePath) {
      console.log("File path updated:", filePath);
      sendCaptchaAndPromptToGemini();
      // handleSaveResult();
    }
  }, [filePath]); // Listener for changes in filePath

 // Call when the user finishes the CAPTCHA test
  const handleCaptchaChange = (token) => {
    console.log("Captcha token:", token);
    if (token) {
      setCaptchaToken(token);
      setCaptchaVerified(true);
    } else {
      setCaptchaVerified(false);
      setCaptchaToken("");
    }
  };

  const handleNextPage = () => {
    if (captchaVerified) {
      navigate("/welcome"); 
    } else {
      alert("Please complete the CAPTCHA first!");
    }
  };
  
  // Automatically takes a screenshot on the server side
  const captureScreenshot = async () => {
    const url = "http://localhost:3000/"; // The URL you want to capture
    try {
      const response = await axios.post(
        "http://localhost:5000/screenshot/",
        { url }, // Sending the URL to the server
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Screenshot captured and uploaded successfully!");
        setFilePath(response.data.filePath);
      } else {
        console.error("Error:", response.data.message);
        alert(`Failed to capture screenshot: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error sending request to server:", error);
      alert("An error occurred. Please check the console for details.");
    }
  };

 // A function that sends an image path and a prompt to Gemini and receives a response
  const sendCaptchaAndPromptToGemini = async () => {
    try {
      // Sending the image and prompt to the server
      setLoading(true); // Loading state
      setError(null); // Reset errors
      setGeminiResponse(null); // Reset result
      try {
        const response = await axios.post(
          "http://localhost:5000/analyzeCaptcha",
          {
            filePath: filePath,
            prompt: prompt,
          }
        );
        setLoading(false);

        if (response.data.success) {
          setGeminiResponse(response.data.data); // Saving the response from Gemini
        } else {
          setError(response.data.message || "Failed to process captcha.");
        }
      } catch (error) {
        console.error("Error sending captcha to server:", error);
        setLoading(false);
        setError("An error occurred while processing the captcha.");
      }
    } catch (error) {
      console.error("Error capturing or sending captcha image:", error);
      setLoading(false);
      setError("An error occurred while capturing the captcha.");
    }
  };

  // Linked to the CAPTCHA success / failure button
  const handleSaveResult = async () => {
    if (isCaptchaSuccessful === null) {
      alert("Please select whether the CAPTCHA was successful or not.");
      return;
    }
    try {
      const payload = {
        filePath: filePath,
        prompt: prompt,
        geminiResponse: geminiResponse,
        isCaptchaSuccessful: isCaptchaSuccessful,
      };

      const response = await axios.post(
        "http://localhost:5000/captchaData",
        payload
      );

      if (response.data.success) {
        alert("Result saved successfully!");
      } else {
        alert("Failed to save the result.");
      }
    } catch (error) {
      console.error("Error saving the result:", error);
      alert("An error occurred while saving the result.");
    }
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "40px",
        paddingTop: "100px", 
        backgroundColor: "#f0f4f8",
        minHeight: "100vh",
      }}
    >
      <NavigationMenu />
  
      <Typography variant="h4" gutterBottom>
        Google reCAPTCHA Test
      </Typography>
  
      <Typography variant="body1" gutterBottom sx={{ marginBottom: "20px" }}>
        Please complete the CAPTCHA below:
      </Typography>
  
      <Box
  sx={{
    display: "flex",
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "30px", 
    width: "100%",
  }}
>
 
  <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start", marginTop: "130px" }}>
    <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
  </Box>

  <Box
    sx={{
      display: "flex",
      flexDirection: "row", 
      gap: "10px", 
      justifyContent: "center",
      flex: 1,
    }}
  >
    <Button
      variant="contained"
      color="primary"
      onClick={handleNextPage}
      disabled={!isCaptchaSuccessful}
    >
      Next Page
    </Button>
    <Button
      variant="contained"
      sx={{
        backgroundColor: "#5b9efc",
        "&:hover": {
          backgroundColor: "#4687e6",
        },
      }}
      onClick={() => {
        setTimeout(() => {
          captureScreenshot();
        }, 3000); 
      }}
    >
      Capture Screenshot
    </Button>
  </Box>

  <Box sx={{ flex: 1 }} />
</Box>

  
      {loading && (
        <Box mt={4}>
          <CircularProgress />
          <Typography variant="body2" sx={{ marginTop: "10px" }}>
            Processing...
          </Typography>
        </Box>
      )}
  
      {error && (
        <Typography variant="body2" color="error" mt={2}>
          {error}
        </Typography>
      )}
  
      {verificationResult && (
        <Typography variant="h6" color="success" mt={2}>
          {verificationResult}
        </Typography>
      )}
  
      {geminiResponse && (
        <Paper
          elevation={1}
          sx={{
            padding: "20px",
            marginTop: "30px",
            backgroundColor: "#ffffff",
            textAlign: "left",
            maxWidth: "500px",
            margin: "auto",
          }}
        >
          <Typography variant="h6">Gemini Response:</Typography>
          <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
            {geminiResponse}
          </Typography>
        </Paper>
      )}
  
      <Box mt={5}>
        <Typography variant="body1" gutterBottom>
          Was the CAPTCHA successful?
        </Typography>
        <Box display="flex" justifyContent="center" mt={2}>
          <RadioGroup
            row
            value={isCaptchaSuccessful}
            onChange={(e) => setIsCaptchaSuccessful(e.target.value === "true")}
          >
            <FormControlLabel value="true" control={<Radio />} label="Yes" />
            <FormControlLabel value="false" control={<Radio />} label="No" />
          </RadioGroup>
        </Box>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => {
            handleSaveResult();
          }}
          sx={{ mt: 3 }}
          disabled={isCaptchaSuccessful === null}
        >
          Submit Result
        </Button>
      </Box>
    </Box>
  );
  
};

export default CaptchaTest;

//גירסה 1-html2canvas
// const captureAndSendCaptcha = async () => {
//   console.log("captureAndSendCaptcha");

//   try {
//     // הגדרת המידות של אזור הצילום
//     const x = 50; // מיקום X (התחלה מ-50 פיקסלים מהקצה השמאלי של הדף)
//     const y = 100; // מיקום Y (התחלה מ-100 פיקסלים מהקצה העליון של הדף)
//     const width = 800; // רוחב אזור הצילום (400 פיקסלים)
//     const height = 400; // גובה אזור הצילום (200 פיקסלים)

//     // צילום מסך של אזור מדויק בעמוד
//     const canvas = await html2canvas(document.body);

//     // , {
//     //   x: x, // מיקום הצילום בציר X
//     //   y: y, // מיקום הצילום בציר Y
//     //   width: width, // רוחב הצילום
//     //   height: height, // גובה הצילום
//     // }
//     console.log("canvas");
//     console.log(canvas);
//     const imageData = canvas.toDataURL("image/png"); // המרת ה-canvas לתמונה בפורמט Base64

//     // הצגת התמונה שנלקחה (לצורך הדגמה)
//     const imageElement = document.createElement("img");
//     imageElement.src = imageData; // הגדרת מקור התמונה כנתון Base64 שהתקבל
//     document.body.appendChild(imageElement); // הוספת התמונה לדף

//     // שליחת התמונה לשרת (במידת הצורך)
//     // const response = await axios.post(
//     //   "http://localhost:5000/upload-captcha-image",
//     //   {
//     //     image: imageData,
//     //   }
//     // );

//     // console.log("Server response:", response.data);
//     // alert(response.data.message || "Captcha image sent successfully!");
//   } catch (error) {
//     console.error("Error capturing or sending captcha image:", error);
//     alert("An error occurred. Please check the console for details.");
//   }
// };

//גירסה 2
// const captureScreenshot = async () => {
//   const url = "http://localhost:3000/"; // ה-URL שברצונך לצלם

//   try {
//     const response = await axios.post(
//       "http://localhost:5000/screenshot/",
//       { url }, // שליחת ה-URL לשרת
//       {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (response.data.success) {
//       console.log("Screenshot successfully captured and uploaded!");
//       console.log("Response from server:", response.data.geminiResponse);
//       alert("Screenshot captured and uploaded successfully!");
//     } else {
//       console.error("Error:", response.data.message);
//       alert(`Failed to capture screenshot: ${response.data.message}`);
//     }
//   } catch (error) {
//     console.error("Error sending request to server:", error);
//     alert("An error occurred. Please check the console for details.");
//   }
// };
//פונקציה עובדת עם חלונית קופצת לצילום מסך
// const captureAndSendCaptcha = async () => {
//   console.log("captureAndSendCaptcha");

//   try {
//     // בקשת הרשאה ללכידת המסך
//     const stream = await navigator.mediaDevices.getDisplayMedia({
//       video: { mediaSource: "screen" },
//     });

//     // יצירת אלמנט וידאו כדי לקבל את זרם המסך
//     const video = document.createElement("video");
//     video.srcObject = stream;
//     await video.play();

//     // הוספת השהיה של 2 שניות כדי לאפשר לחלון הבחירה להיעלם
//     await new Promise((resolve) => setTimeout(resolve, 2000));

//     // יצירת canvas ולכידת המסך
//     const canvas = document.createElement("canvas");
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // עצירת הזרם כדי למנוע דליפת משאבים
//     stream.getTracks().forEach((track) => track.stop());

//     // הגדרת האזור לחיתוך (לפי פיקסלים)
//     const clipX = 380; // התחלת X
//     const clipY = 130; // התחלת Y
//     const clipWidth = 510; // רוחב החיתוך
//     const clipHeight = 820; // גובה החיתוך

//     // יצירת canvas חדש לחיתוך
//     const croppedCanvas = document.createElement("canvas");
//     croppedCanvas.width = clipWidth;
//     croppedCanvas.height = clipHeight;

//     const croppedCtx = croppedCanvas.getContext("2d");
//     croppedCtx.drawImage(
//       canvas,
//       clipX,
//       clipY,
//       clipWidth,
//       clipHeight,
//       0,
//       0,
//       clipWidth,
//       clipHeight
//     );

//     // // המרת התמונה לנתון Base64
//     // const imageData = canvas.toDataURL("image/png");

//     // // הצגת התמונה שנלקחה (לצורך הדגמה)
//     // const imageElement = document.createElement("img");
//     // imageElement.src = imageData; // הגדרת מקור התמונה כנתון Base64 שהתקבל
//     // document.body.appendChild(imageElement); // הוספת התמונה לדף

//     // המרת התמונה החדשה לנתון Base64
//     const croppedImageData1 = croppedCanvas.toDataURL("image/png");

//     // הצגת התמונה שנחתכה (לצורך הדגמה)
//     const croppedImageElement = document.createElement("img");
//     croppedImageElement.src = croppedImageData1;
//     document.body.appendChild(croppedImageElement);

//     // const croppedImageData = croppedCanvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");

//     const croppedImageData = croppedCanvas.toDataURL("image/jpeg", 0.7) // מקודדת תמונה ל-JPEG ודוחסת ל-70%
//       .replace(/^data:image\/jpeg;base64,/, "");
//     // העלאה לג'מיני
//     // await analyzeCaptchaWithGemini(base64Data);
//     setCroppedImageData(croppedImageData);

//     const prompt = "There are squares in the image. Number the squares from left to right, top to bottom, and explain what is in each square. Then, identify which squares to select and tell me which numbered squares to choose.";
//     // שליחת התמונה לשרת (אם יש צורך)
//     // const response = await axios.post("http://localhost:5000/upload-captcha-image", { image: imageData });
//     // console.log("Server response:", response.data);
//     // alert(response.data.message || "Captcha image sent successfully!");

//     // שליחת התמונה והפרומפט לשרת
//     setLoading(true); // מצב טעינה
//     setError(null); // איפוס שגיאות
//     setGeminiResponse(null); // איפוס תוצאה

//     try {

//       const response = await axios.post("http://localhost:5000/analyzeCaptcha", {
//         imageBase64: croppedImageData,
//         prompt,
//       });

//       setLoading(false);

//       if (response.data.success) {
//         setGeminiResponse(response.data.data); // שמירת התשובה מגימיני
//         console.log("Gemini Response:", response.data.data);
//         console.log("response.data", response.data)
//       } else {
//         setError(response.data.message || "Failed to process captcha.");
//       }
//     } catch (error) {
//       console.error("Error sending captcha to server:", error);
//       setLoading(false);
//       setError("An error occurred while processing the captcha.");
//     }
//   } catch (error) {
//     console.error("Error capturing or sending captcha image:", error);
//     setLoading(false);
//     setError("An error occurred while capturing the captcha.");
//   }

// };


//גירסת עיברית לעיצוב
// <Box
    //   sx={{
    //     textAlign: "center",
    //     padding: "40px",
    //     paddingTop: "100px", // להזיז את התוכן למטה
    //     backgroundColor: "#f0f4f8",
    //     minHeight: "100vh",
    //   }}
    // >
    //   <NavigationMenu />
  
    //   <Typography variant="h4" gutterBottom>
    //     Google reCAPTCHA Test
    //   </Typography>
  
    //   <Typography variant="body1" gutterBottom sx={{ marginBottom: "20px" }}>
    //     Please complete the CAPTCHA below:
    //   </Typography>
  
    //   <Box
    //     sx={{
    //       display: "flex",
    //       justifyContent: "space-between", // הקפצ'ה בצד ימין, כפתורים במרכז
    //       alignItems: "center", // יישור בגובה
    //       marginBottom: "30px", // מרווח מתחת לאזור
    //       width: "100%", // יתפוס את כל הרוחב
    //     }}
    //   >
    //     {/* קופסה ריקה עבור יישור מרווח משמאל */}
    //     <Box sx={{ flex: 1 }} />
  
    //     {/* הכפתורים במרכז */}
    //     <Box
    //       sx={{
    //         display: "flex",
    //         flexDirection: "row", // הכפתורים יופיעו אחד ליד השני
    //         gap: "10px", // מרווח בין הכפתורים
    //       }}
    //     >
    //       <Button
    //         variant="contained"
    //         color="primary"
    //         onClick={handleSubmit}
    //         disabled={!isCaptchaSuccessful}
    //       >
    //         Next Page
    //       </Button>
    //       <Button
    //         variant="contained"
    //         sx={{
    //           backgroundColor: "#5b9efc",
    //           "&:hover": {
    //             backgroundColor: "#4687e6",
    //           },
    //         }}
    //         onClick={() => {
    //           setTimeout(() => {
    //             captureScreenshot();
    //           }, 3000); // הפעלה לאחר 3 שניות
    //         }}
    //       >
    //         Capture Screenshot
    //       </Button>
    //     </Box>
  
    //     {/* הקפצ'ה בצד ימין */}
    //     <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-end" , marginTop: "130px" }}>
    //       <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={handleCaptchaChange} />
    //     </Box>
    //   </Box>
  
    //   {loading && (
    //     <Box mt={4}>
    //       <CircularProgress />
    //       <Typography variant="body2" sx={{ marginTop: "10px" }}>
    //         Processing...
    //       </Typography>
    //     </Box>
    //   )}
  
    //   {error && (
    //     <Typography variant="body2" color="error" mt={2}>
    //       {error}
    //     </Typography>
    //   )}
  
    //   {verificationResult && (
    //     <Typography variant="h6" color="success" mt={2}>
    //       {verificationResult}
    //     </Typography>
    //   )}
  
    //   {geminiResponse && (
    //     <Paper
    //       elevation={1}
    //       sx={{
    //         padding: "20px",
    //         marginTop: "30px",
    //         backgroundColor: "#ffffff",
    //         textAlign: "left",
    //         maxWidth: "500px", // צמצום הרוחב של התשובה
    //         margin: "auto",
    //       }}
    //     >
    //       <Typography variant="h6">Gemini Response:</Typography>
    //       <Typography variant="body2" style={{ whiteSpace: "pre-line" }}>
    //         {geminiResponse}
    //       </Typography>
    //     </Paper>
    //   )}
  
    //   <Box mt={5}>
    //     <Typography variant="body1" gutterBottom>
    //       Was the CAPTCHA successful?
    //     </Typography>
    //     <Box display="flex" justifyContent="center" mt={2}>
    //       <RadioGroup
    //         row
    //         value={isCaptchaSuccessful}
    //         onChange={(e) => setIsCaptchaSuccessful(e.target.value === "true")}
    //       >
    //         <FormControlLabel value="true" control={<Radio />} label="Yes" />
    //         <FormControlLabel value="false" control={<Radio />} label="No" />
    //       </RadioGroup>
    //     </Box>
    //     <Button
    //       variant="outlined"
    //       color="primary"
    //       onClick={() => {
    //         alert("Result submitted!");
    //         handleSaveResult();
    //       }}
    //       sx={{ mt: 3 }}
    //       disabled={isCaptchaSuccessful === null}
    //     >
    //       Submit Result
    //     </Button>
    //   </Box>
    // </Box>