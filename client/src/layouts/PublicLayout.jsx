import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const PublicLayout = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) return <Navigate to="/dashboard" />;

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default PublicLayout;
