import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle } from "lucide-react";
import "../style.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const { register, loading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError("");
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      // Handled by context
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
          <h1>Join ChaCeylon</h1>
          <p>
            Experience authentic Sri Lankan single-origin tea, Ayurvedic blends and exclusive estate harvests delivered to your doorstep.
          </p>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="login-section">
        <div className="login-box" style={{ maxWidth: "460px" }}>
          <div className="login-logo">
            🌱
          </div>

          <h2>Create Account</h2>
          <p className="login-description">
            Register as a new ChaCeylon customer (POST /api/auth/register)
          </p>

          {(validationError || authError) && (
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
              <span>{validationError || authError}</span>
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Kasun Fernando"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="Choose a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
              style={{ marginTop: "10px" }}
            >
              {loading ? "Registering on Server..." : "Create ChaCeylon Account"}
            </button>
          </form>

          <p className="register-text">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
