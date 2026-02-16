import { useState } from "react";
import "./login.css";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ email, password });

    axios({
      method: "POST",
      url: "http://localhost:8000/api/auth/login",
      data: {
        email: email,
        password: password,
      },
    })
      .then((response) => {
        console.log("Response is ", response);
      })
      .catch((e) => {
        console.log("ERROR DETECTED : ", e);
      });
    // later: call login API
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
