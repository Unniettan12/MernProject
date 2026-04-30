import React, { useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { CiPower } from "react-icons/ci";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { GrCaretNext, GrCaretPrevious } from "react-icons/gr";

const SidebarItem = ({
  title,
  onClickFunc = () => {},
  Icon = () => {
    return null;
  },
  sidebarOpen = false,
}) => {
  return (
    <button
      onClick={onClickFunc}
      className={`w-full flex items-center flex-row text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${sidebarOpen ? "justify-start" : "!px-0 justify-center"}`}
    >
      <div className={`${sidebarOpen && "mr-4"}`}>
        <Icon />
      </div>
      <p className="transition">{sidebarOpen ? title : ""}</p>
    </button>
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
      console.log("error in logging out :", error);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-14"
        } flex flex-col`}
      >
        {/* Top spacer */}
        <div
          className={`h-12 border-b border-gray-200 flex ${sidebarOpen ? "justify-end" : "justify-center"} items-center px-2`}
        >
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            // className="transparent_button text-sm"
          >
            {sidebarOpen ? <GrCaretPrevious /> : <GrCaretNext />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <SidebarItem
            sidebarOpen={sidebarOpen}
            title="Dashboard"
            onClickFunc={() => navigate("dashboard")}
            Icon={() => <MdOutlineSpaceDashboard />}
          />
          <SidebarItem
            sidebarOpen={sidebarOpen}
            title="Notes"
            onClickFunc={() => navigate("dashboard/notes")}
            Icon={() => <CgNotes />}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Navbar */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-end px-4 py-3">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 transparent_button"
          >
            <CiPower />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Page Content */}
        <div className="p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
