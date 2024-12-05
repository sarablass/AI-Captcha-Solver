# AI CAPTCHA Solver

An AI-powered CAPTCHA assistance system that integrates with Google reCAPTCHA and Gemini AI to enhance user interactions with CAPTCHA challenges by providing intelligent image selection recommendations.

## Features

- **AI-Powered Recommendations**: Uses Gemini AI to analyze CAPTCHA images and recommend accurate selections.
- **Google reCAPTCHA Integration**: Seamless interaction with Google’s reCAPTCHA for real-time validation.
- **Feedback Mechanism**: Collects user feedback on AI recommendations to evaluate success and failure rates.
- **Analytics Dashboard**: Displays performance metrics such as success and failure percentages based on user feedback.
- **Intuitive User Interface**: Built with Material-UI to provide a sleek and user-friendly experience for interacting with CAPTCHA data.

## Tech Stack

- **Frontend**: React.js, Material-UI
- **Backend**: Node.js, JavaScript
- **Database**: MongoDB Atlas
- **AI Integration**: Gemini AI
- **Other Tools**: Google reCAPTCHA API

## Project Workflow

1. **User Interaction**: Users are presented with a CAPTCHA challenge.
2. **AI Recommendation**: Gemini AI analyzes the CAPTCHA and suggests which images to select.
3. **User Validation**: Users make selections based on AI recommendations.
4. **Feedback Collection**: The system records the correctness of the AI’s suggestions.
5. **Data Storage**: Feedback and CAPTCHA interaction data are stored in MongoDB Atlas for analysis.
6. **Performance Evaluation**: Success and failure rates are calculated and displayed.
