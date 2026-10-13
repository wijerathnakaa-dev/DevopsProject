import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, Lock, Mail, ArrowRight } from "lucide-react";
import "../style.css";

function Login() {
  const [email, setEmail] = useState("customer@example.com");
  const [password, setPassword] = useState("password123");
  const { login, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      // authError is set in context
    }
  };

  const handleFastFill = (role) => {
    if (role === "admin") {
      setEmail("admin@chaceylon.lk");
      setPassword("admin123");
    } else {
      setEmail("customer@example.com");
      setPassword("password123");
    }
  };

  return (
    <div className="login-page">
      {/* Left Side: Brand Imagery */}
      <div className="login-image">
        <div className="image-overlay">
          <img
            src="/images/logo.png"
            alt="Cha Ceylon Logo"
            style={{ height: "70px", width: "auto", marginBottom: "16px", filter: "brightness(0) invert(1)" }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <h1>ChaCeylon</h1>
          <p>
            Discover the authentic taste of single-origin orthodox Sri Lankan tea and herbal elixirs.
          </p>
          <div style={{ marginTop: "24px", fontSize: "14px", color: "#d1ddd6", borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "16px" }}>
            DevOps Engineering Group 87 • REST API Architecture
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="login-section">
        <div className="login-box">
          <div className="login-logo">
            🍃
          </div>

          <h2>Welcome Back!</h2>
          <p className="login-description">
            Sign in to your ChaCeylon customer or admin account
          </p>

          {authError && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "20px",
              fontSize: "13.5px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <AlertCircle size={18} />
              <span>{authError}</span>
            </div>
          )}

          {/* Fast-fill buttons for evaluator */}
          <div style={{ marginBottom: "20px", background: "var(--primary-subtle)", padding: "12px", borderRadius: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--primary)", display: "block", marginBottom: "8px", textTransform: "uppercase" }}>
              Quick Demo Fill:
            </span>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: "12px", padding: "6px" }}
                onClick={() => handleFastFill("customer")}
              >
                👤 Customer
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ flex: 1, fontSize: "12px", padding: "6px" }}
                onClick={() => handleFastFill("admin")}
              >
                🛡️ Admin
              </button>
            </div>
          </div>

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
                <input type="checkbox" defaultChecked /> Remember me
              </label>
              <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                POST /api/auth/login
              </span>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "Authenticating with Express..." : "Sign In to ChaCeylon"}
            </button>
          </form>

          <p className="register-text">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;