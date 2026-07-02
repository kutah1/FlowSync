import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import HomePage from "./pages/HomePage";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import WelcomeScreen from "./pages/WelcomeScreen";
import LastPeriod from "./pages/LastPeriod";
import CycleLength from "./pages/CycleLength";
import ProductivityStyle from "./pages/ProductivityStyle";

import AppShell from "./components/layout/AppShell";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import MoodTracker from "./pages/MoodTracker";
import DailySummary from "./pages/DailySummary";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Full-screen (no shell): landing, auth, onboarding */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<CreateAccount />} />
        <Route path="/login" element={<Login />} />

        <Route path="/onboarding/welcome" element={<WelcomeScreen />} />
        <Route path="/onboarding/cycle" element={<LastPeriod />} />
        <Route path="/onboarding/cycle-length" element={<CycleLength />} />
        <Route path="/onboarding/style" element={<ProductivityStyle />} />

        {/* In-app (shell-wrapped): bottom tabs on mobile, sidebar on desktop */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="checkin" element={<MoodTracker />} />
          <Route path="summary" element={<DailySummary />} />
          <Route path="insights" element={<Insights />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
