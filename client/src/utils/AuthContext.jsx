import axios from "axios";
import { createContext, useContext, useState, useEffect } from "react";
import api, { setUnauthorizedHandler } from "../services/dashboardApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setUserFunc = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/me");

      if (!res?.ok) throw new Error("Unauthorized");

      const response = await res.json();
      console.log("response inisde authcontext is :", response?.user);

      setUser(response?.user);
      setIsAuthenticated(true);
    } catch (error) {
      // localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      throw new Error("User not verified");
    }
  };

  const registerFunc = async (email, password, confirmPassword) => {
    // setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:8000/api/auth/register",
        data: {
          email: email,
          password: password,
          confirmPass: confirmPassword,
        },
      });
      if (response) {
        console.log("resp is ", response);
      }
      // if (!response?.data?.jwt) {
      //   throw new Error("Token not received!");
      // }

      // let token = response?.data?.jwt;
      // localStorage.setItem("token", token);

      // await setUserFunc(token);
    } catch (error) {
      let errorObj = error.response.data;
      if (errorObj) {
        let err = new Error("error");
        err.data = errorObj;
        throw err;
      }
    } finally {
      // setIsLoading(false);
    }
  };

  const loginFunc = async (email, password) => {
    // setIsLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: "http://localhost:8000/api/auth/login",
        data: {
          email: email,
          password: password,
        },
      });

      // if (response?.status !== 200) {
      //   throw new Error("Unable to reach server : ", response?.statusText);
      // }

      console.log("login response is ", response);
      // await setUserFunc(token);
    } catch (error) {
      console.log("error is ", error);
      let errorObj = error.response.data;
      if (errorObj) {
        let err = new Error("error");
        err.data = errorObj;
        throw err;
      }
    } finally {
      // setIsLoading(false);
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
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const forceLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }
    setUserFunc(token);
    setIsLoading(false);
    setUnauthorizedHandler(forceLogout);
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
        registerFunc,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
