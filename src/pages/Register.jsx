import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AlertCircle,
  Lock,
  Mail,
  User,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  Leaf,
  Truck,
  Award
} from "lucide-react";
import "../style.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const { register, loading, authError } = useAuth();
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
    <div className="auth-page-wrapper">
      {/* Left Visual Story Showcase */}
      <div className="auth-showcase">
        <div className="auth-showcase-glow" />

        <div className="auth-showcase-content">
          {/* Top Bar with Back Link */}
          <div className="auth-showcase-top">
            <Link to="/" className="auth-back-btn">
              <ArrowLeft size={16} /> Return to Store
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <img
                src="/images/logo.png"
                alt="ChaCeylon Crest"
                style={{ height: "38px", width: "auto", filter: "brightness(0) invert(1)" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
          </div>

          {/* Central Hero Headline & Story */}
          <div>
            <div className="auth-brand-badge">
              <Sparkles size={14} /> The Royal Ceylon Estate Club
            </div>

            <h1 className="auth-hero-heading">
              Pure Ceylon Heritage. <br />
              <span className="gold-text">Delivered to Your Doorstep.</span>
            </h1>

            <p className="auth-hero-lead">
              Create your ChaCeylon account to enjoy fast islandwide ordering, direct estate harvest reserve allocations, and real-time package dispatch tracking.
            </p>

            {/* Engaging Feature Cards */}
            <div className="auth-perks-grid">
              <div className="auth-perk-card">
                <div className="auth-perk-icon-wrap">
                  <Leaf size={18} />
                </div>
                <div>
                  <div className="auth-perk-title">Direct Highland Single Estate</div>
                  <p className="auth-perk-desc">Authentic hand-plucked harvests from Nuwara Eliya & Galle hills</p>
                </div>
              </div>

              <div className="auth-perk-card">
                <div className="auth-perk-icon-wrap">
                  <Award size={18} />
                </div>
                <div>
                  <div className="auth-perk-title">100% Lion Seal Authenticity</div>
                  <p className="auth-perk-desc">Certified pure Ceylon tea leaves free of artificial flavoring or chemicals</p>
                </div>
              </div>

              <div className="auth-perk-card">
                <div className="auth-perk-icon-wrap">
                  <Truck size={18} />
                </div>
                <div>
                  <div className="auth-perk-title">Free Islandwide Delivery</div>
                  <p className="auth-perk-desc">Complimentary shipping across Sri Lanka on all orders over LKR 5,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tea Note */}
          <div className="auth-showcase-quote">
            “From unopened velvety silver buds to Ayurvedic spiced chai elixirs, experience Ceylon tea at its purest state.”
          </div>
        </div>
      </div>

      {/* Right Interactive Registration Card */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <div className="auth-logo-badge">
              <img
                src="/images/logo.png"
                alt="ChaCeylon Elephant Crest"
                style={{ height: "42px", width: "auto" }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>

            <h2 className="auth-form-title">Create Account</h2>
            <p className="auth-form-subtitle">
              Join ChaCeylon to track your orders and savor fresh highland teas.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="auth-tab-switch">
            <Link to="/login" className="auth-tab-btn">Sign In</Link>
            <span className="auth-tab-btn active">Create Account</span>
          </div>

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
            <div className="auth-input-group">
              <label>Full Name</label>
              <div className="auth-input-wrap">
                <User size={18} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-text-input"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={18} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-text-input"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label>Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-text-input with-toggle"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="auth-toggle-pwd-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-input-group">
              <label>Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-text-input"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              style={{ marginTop: "12px" }}
            >
              {loading ? (
                <>Creating Account...</>
              ) : (
                <>
                  Create ChaCeylon Account <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Trust Footer */}
          <div className="auth-trust-footer">
            <div className="auth-trust-item">
              <ShieldCheck size={14} color="var(--primary)" />
              <span>256-bit Encrypted</span>
            </div>
            <div className="auth-trust-item">
              <Award size={14} color="var(--accent-gold)" />
              <span>100% Pure Ceylon Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
