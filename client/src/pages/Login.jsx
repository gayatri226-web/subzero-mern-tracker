import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("loggedIn", "true");
      navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1 className="login-title">SUBZERO</h1>
        <p className="login-subtitle">
          Control your auto-pay burn
        </p>

        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-button" type="submit">
            LOGIN
          </button>
        </form>

        <div className="login-footer">
          Don’t have an account? <span>Sign up</span>
        </div>

      </div>
    </div>
  );
}
