import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import MonthlyGoals from "../pages/MonthlyGoals";
import YearlyGoals from "../pages/YearlyGoals";
import ProtectedRoute from "./ProtectedRoutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Home />} />
        <Route path="/register" element={<Home />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/tasks" element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        } />

        <Route path="/monthly-goals" element={
          <ProtectedRoute>
            <MonthlyGoals />
          </ProtectedRoute>
        } />

        <Route path="/yearly-goals" element={
          <ProtectedRoute>
            <YearlyGoals />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}