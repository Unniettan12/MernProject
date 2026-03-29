import axios from "axios";
import React, { useState } from "react";
import { useAuth } from "../utils/AuthContext";
// import { MenuIcon, XIcon } from "@heroicons/react/solid";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logoutFunc } = useAuth();
  const onLogout = async (e) => {
    e.preventDefault();
    try {
      await logoutFunc();
    } catch (error) {
      console.log("error in logging out in :", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      {/* {sidebarOpen && (
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-20">
          <div className="p-4 border-b">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-700"
            >
              <p>X Icon</p>
            </button>
          </div>

          <nav className="p-4">
            <p className="text-gray-500">Sidebar item 1</p>
            <p className="text-gray-500">Sidebar item 2</p>
          </nav>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
          <div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 focus:outline-none"
            >
              <p>Menu Icon</p>
            </button>
          </div>

          <div>
            <button onClick={onLogout} className="text-red-600 font-semibold">
              Logout
            </button>
          </div>
        </header> */}

      {/* Main Content */}
      <main className="p-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="mt-4 text-gray-600">
          Welcome to your dashboard! Content goes here.
        </p>
      </main>
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
