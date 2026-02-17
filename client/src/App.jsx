import { useState } from "react";
import "./App.css";
import Login from "./login/login";
import { AuthProvider, useAuth } from "./utils/AuthContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./common/Dashboard";
import NotFound from "./common/NotFound";

const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) return <div>Loading...</div>;
  return !isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  const { isLoading, isAuthenticated } = useAuth();
  return (
    <>
      <div className="login_root">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  isLoading={isLoading}
                >
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
