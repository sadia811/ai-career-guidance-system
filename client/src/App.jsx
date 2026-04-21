import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import ExploreCareersPage from "./pages/ExploreCareersPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WelcomePage from "./pages/WelcomePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import DashboardPage from "./pages/DashboardPage";
import CareerPredictionPage from "./pages/CareerPredictionPage";
import RoadmapPage from "./pages/RoadmapPage";
import ProgressTrackerPage from "./pages/ProgressTrackerPage";
import CoursesPage from "./pages/CoursesPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import SettingsPage from "./pages/SettingsPage";
import AdminMessagesPage from "./pages/AdminMessagesPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/profile-setup" element={<ProfileSetupPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/career-prediction" element={<CareerPredictionPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/explore-careers" element={<ExploreCareersPage />} />
      <Route path="/app/explore-careers" element={<ExploreCareersPage />} />
      <Route path="/progress-tracker" element={<ProgressTrackerPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/admin/messages" element={<AdminMessagesPage />} />
    </Routes>
  );
}

export default App;