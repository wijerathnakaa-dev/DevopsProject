import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AlertCircle,
  Lock,
  Mail,
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

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, authError } = useAuth();
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
              <Sparkles size={14} /> Premium Herbal Export Brand
            </div>

            <h1 className="auth-hero-heading">
              Nature's Blend <br />
              <span className="gold-text">for Modern Living.</span>
            </h1>

            <p className="auth-hero-lead">
              Welcome back to ChaCeylon Manufactures — natural food, herbal and beverage products made in Sri Lanka with traditional ingredients and export-quality standards.
            </p>

            {/* Engaging Feature Cards */}
            <div className="auth-perks-grid">
              <div className="auth-perk-card">
                <div className="auth-perk-icon-wrap">
                  <Leaf size={18} />
                </div>
                <div>
                  <div className="auth-perk-title">Quality Sri Lankan Ingredients</div>
                  <p className="auth-perk-desc">Carefully selected herbs, spices, fruits and natural ingredients</p>
                </div>
              </div>

              <div className="auth-perk-card">
                <div className="auth-perk-icon-wrap">
                  <Award size={18} />
                </div>
                <div>
                  <div className="auth-perk-title">Export-Quality Standards</div>
                  <p className="auth-perk-desc">Manufactured for both local and international markets</p>
                </div>
              </div>

              <div className="auth-perk-card">
                <div className="auth-perk-icon-wrap">
                  <Truck size={18} />
                </div>
                <div>
                  <div className="auth-perk-title">Freshness-Sealed & Free Delivery</div>
                  <p className="auth-perk-desc">Direct factory dispatch with free delivery on orders over LKR 5,000</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tea Note */}
          <div className="auth-showcase-quote">
            “Natural • Healthy • Traditional • Trusted”
          </div>
        </div>
      </div>

      {/* Right Interactive Sign-In Card */}
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

            <h2 className="auth-form-title">Welcome Back</h2>
            <p className="auth-form-subtitle">
              Sign in to your ChaCeylon account to manage your orders & discover limited harvests.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="auth-tab-switch">
            <span className="auth-tab-btn active">Sign In</span>
            <Link to="/register" className="auth-tab-btn">Create Account</Link>
          </div>

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

          <form onSubmit={handleLogin}>
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
                  placeholder="Enter your account password"
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

            <div className="auth-options-row">
              <label>
                <input type="checkbox" defaultChecked style={{ accentColor: "var(--primary)" }} /> Remember me
              </label>
              <Link to="/products" style={{ color: "var(--accent-gold-dark)", fontWeight: 600 }}>
                Explore Teas First →
              </Link>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>Signing in...</>
              ) : (
                <>
                  Sign In to ChaCeylon <ArrowRight size={17} />
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

export default Login;