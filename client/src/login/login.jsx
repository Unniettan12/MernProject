import { useState } from "react";
import "./login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loginFunc } = useAuth();

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginFunc(email, password);
    } catch (error) {
      console.log("error in logging in :", error);
    } finally {
      // navigate("/dashboard");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
