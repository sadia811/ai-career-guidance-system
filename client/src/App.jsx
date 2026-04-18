import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ExploreCareersPage from "./pages/ExploreCareersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/explore-careers" element={<ExploreCareersPage />} />
      <Route path="/app/explore-careers" element={<ExploreCareersPage />} />
    </Routes>
  );
}

export default App;