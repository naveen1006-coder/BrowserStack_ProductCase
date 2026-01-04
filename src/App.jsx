import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SprintProvider } from "@/context/SprintContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LoginPage } from "@/pages/LoginPage";
import { StrategyPage } from "@/pages/StrategyPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { LaunchPage } from "@/pages/LaunchPage";
import { SuccessPage } from "@/pages/SuccessPage";
import { SprintHistoryPage } from "@/pages/SprintHistoryPage";

function App() {
  // Get base path from Vite's environment variable
  const basePath = import.meta.env.BASE_URL || "/";

  return (
    <ThemeProvider>
      <SprintProvider>
        <Router basename={basePath}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/strategy" element={<StrategyPage />} />
            <Route path="/workspace" element={<WorkspacePage />} />
            <Route path="/launch" element={<LaunchPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/history" element={<SprintHistoryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SprintProvider>
    </ThemeProvider>
  );
}

export default App;
