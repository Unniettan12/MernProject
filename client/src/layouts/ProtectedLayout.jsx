import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

const SidebarItem = ({ title, children, onClickFunc = () => {} }) => {
  return (
    <div onClick={onClickFunc}>
      <p className="text-gray-500">{title}</p>
    </div>
  );
};

const ProtectedLayout = () => {
  const { isLoading, isAuthenticated, logoutFunc } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();

  const onLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutFunc();
    } catch (error) {
      console.log("error in logging out in :", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return (
    <div className="flex h-dvh bg-gray-100 flex-col w-full">
      {/* Header */}
      {/* Content */}
      <div className="flex flex-row w-full h-full ">
        <div
          className={`flex flex-col h-full inset-y-0 left-0 w-${sidebarOpen ? 64 : 10} bg-white  shadow-lg z-20 `}
        >
          <div className="px-4 border-b min-h-10 "></div>

          <nav className="p-4">
            {/* Sidebar items go here */}
            <SidebarItem
              title="Dashboard"
              onClickFunc={() => {
                navigate("dashboard");
              }}
            />
            <SidebarItem
              title="Notes"
              onClickFunc={() => {
                navigate("dashboard/notes");
              }}
            />
            <SidebarItem />
          </nav>
          <div className="flex self-end">
            <button
              onClick={() => {
                let prevState = sidebarOpen;
                setSidebarOpen(!prevState);
              }}
              className="text-gray-700"
            >
              <p>X Icon</p>
              {/* <XIcon className="h-6 w-6" /> */}
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="nav_bar flex top-0 bg-red-400 min-h-10 w-full justify-end">
            <div className="flex" onClick={onLogout}>
              <p>Logout</p>
            </div>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
