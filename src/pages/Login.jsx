import { useState } from "react";
import "../style.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-page">

      {/* Left Side */}
      <div className="login-image">

        <div className="image-overlay">
          <h1>ChaCeylon</h1>

          <p>
            Discover the authentic taste of
            premium Sri Lankan tea.
          </p>
        </div>

      </div>

      {/* Right Side */}
      <div className="login-section">

        <div className="login-box">

          <div className="login-logo">
            🍃
          </div>

          <h2>Welcome Back!</h2>

          <p className="login-description">
            Login to your ChaCeylon account
          </p>

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="login-options">
              <label>
                <input type="checkbox" />
                Remember me
              </label>

              <a href="#">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

          </form>

          <p className="register-text">
            Don't have an account?
            <a href="#"> Register</a>
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;