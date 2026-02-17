import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setUserFunc = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res?.ok) throw new Error("Unauthorized");

      const response = await res.json();
      console.log("response inisde authcontext is :", response?.user);

      setUser(response?.user);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const loginFunc = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:8000/api/auth/login",
        data: {
          email: email,
          password: password,
        },
      });
      console.log("response is ", response?.status);
      if (response?.status !== 200) {
        throw new Error("Unable to reach server : ", response?.statusText);
      }
      if (!response?.data?.jwt) {
        throw new Error("Token not received!");
      }

      let token = response?.data?.jwt;
      localStorage.setItem("token", token);

      await setUserFunc(token);
    } catch (error) {
      console.log("ERROR DETECTED : ", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutFunc = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: "GET",
        url: "http://localhost:8000/api/auth/logout",
      });

      if (response?.status !== 200) {
        throw new Error("Server error");
      }
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.log("Error is :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    setUserFunc(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        setUser,
        loginFunc,
        logoutFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
