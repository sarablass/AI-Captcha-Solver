import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CaptchaTest from "./CaptchaTest";
import CaptchaTable from "./CaptchaTable";
import WelcomePage from "./WelcomePage"; // העמוד החדש



const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/captchaTest" />} />
      <Route path="/captchaTest" element={<CaptchaTest />} />
      <Route path="/captchaTable" element={<CaptchaTable />} />
      <Route path="/welcome" element={<WelcomePage />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;