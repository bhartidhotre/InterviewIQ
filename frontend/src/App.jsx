import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import InterviewController from "./pages/InterviewController";
import Dashboard from "./pages/Dashboard";
import QuestionEngine from "./components/QuestionEngine"; // or pages/QuestionEngine
import AddQuestion from "./components/AddQuestion";
import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import InterviewSummary from "./pages/InterviewSummary"; // ✅ ADD THIS
import ResumeAnalyzer from "./pages/ResumeAnalyzer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Question Engine (Protected) */}
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <QuestionEngine />
            </ProtectedRoute>
          }
        />

         <Route
          path="/resume-check"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Add Question (Admin Only) */}
        <Route
          path="/add-question"
          element={
            <AdminRoute>
              <Navbar />
              <AddQuestion />
            </AdminRoute>
          }
        />

          {/* Interview (SINGLE ENTRY POINT) */}
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewController />
            </ProtectedRoute>
          }
        />

        
        {/* ✅ Interview Summary */}
        <Route
          path="/summary/:sessionId"
          element={
            <ProtectedRoute>
              <InterviewSummary />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
