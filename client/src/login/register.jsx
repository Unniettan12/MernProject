import { useEffect, useState } from "react";
import "./login.css";
import { useAuth } from "../utils/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    email: null,
    password: null,
    confirmPass: null,
  });

  const { registerFunc } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerFunc(email, password, confirmPassword);
    } catch (error) {
      console.log("error ", error.data);
      let errorObj = error.data;
      Object.keys(errorObj).forEach((prop) => {
        setErrors((prev) => ({
          ...prev,
          [prop]: errorObj[prop],
        }));
      });
    }
  };

  const redirectLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    console.log("errors has changed ", errors);
  }, [errors]);

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleRegister}>
        <h2>Login</h2>
        <div className="w-full">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full border p-2 rounded ${
              errors?.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className={`error-text ${errors?.email ? "visible" : ""}`}>
            {errors?.email || ""}
          </p>
        </div>
        <div className="w-full mb-[-1]">
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={`w-full border p-2 rounded ${
              errors?.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className={`error-text ${errors?.password ? "visible" : ""}`}>
            {errors?.password || ""}
          </p>
        </div>
        <div className="w-full">
          <input
            id="confirmPass"
            type="password"
            placeholder="ConfirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={`w-full border rounded ${
              errors?.confirmPass ? "border-red-500" : "border-gray-300"
            }`}
          />
          <p className={`error-text ${errors?.confirmPass ? "visible" : ""}`}>
            {errors?.confirmPass || ""}
          </p>
        </div>
        <div className="flex justify-center items-center">
          <p className="text-sm text-gray-500">
            Already have an account? Click here to{" "}
            <span
              onClick={redirectLogin}
              className="cursor-pointer text-blue-500"
            >
              sign in
            </span>
          </p>
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
