import { Routes, Route } from "react-router-dom";
import LoginPage  from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  );
}

