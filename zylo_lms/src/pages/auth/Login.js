// Login.jsx
import React, { useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../../Images/crtlogo-removebg-preview.png";
import logo1 from "../../Images/lms-bac7-removebg-preview.png";
import { FaGoogle, FaFacebookF, FaTwitter } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Fetch role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const role = userData.role;
        console.log("role======================>>>>>>>>>>>>>>", role);

        // 3. Navigate based on role
        if (role === "student") {
          navigate("/student-dashboard");
        } else if (role === "instructor") {
          navigate("/InstructorDashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          alert("Unknown user role");
        }
      } else {
        alert("No user data found.");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-wrapper-3d">
      <div className="auth-card-3d">
        <div className="auth-left-3d d-none d-md-flex">
          <div className="text-zone">
            <h2>From Learner to Leader!</h2>
            <p>
              Discover your passion, sharpen your skills, and own your journey.
            </p>
            <img
              src={logo1}
              alt="Tech Illustration"
              className="illu-img"
              style={{ maxHeight: "250px" }}
            />
          </div>
        </div>
        <div className="auth-right-3d">
          <div className="logo-box text-center mb-3">
            <img src={logo} alt="Logo" height={80} />

            <h3 style={{ fontWeight: "bold" }} className="mb-1">
              Welcome to Zylo Tech
            </h3>
            <p
              style={{
                color: "black",
                fontSize: "14px",
                marginBottom: "10px",
                fontWeight: "bolder",
              }}
            >
              Please sign in to continue
            </p>
          </div>
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="custom-input-wrapper">
              <span className="input-icon">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="email"
                className="auth-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="custom-input-wrapper">
              <span className="input-icon">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="toggle-password-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                ></i>
              </span>
            </div>

            {/* Forgot Password */}
            <div className="text-end">
              <a href="/forgot-password" className="forgot-password-link">
                Forgot Password ?
              </a>
            </div>

            <button type="submit" className="btn-login">
              Login →
            </button>
            <div className="connect-section">
              <div className="connect-line">
                <span className="line"></span>
                <span className="connect-text">Connect With Us</span>
                <span className="line"></span>
              </div>
              <div className="social-icons">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon linkedin"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a
                  href="https://www.youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon youtube"
                >
                  <i className="fab fa-youtube"></i>
                </a>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon instagram"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon facebook"
                >
                  <i className="fab fa-facebook"></i>
                </a>
                <a
                  href="https://www.twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon twitter"
                >
                  <i className="fab fa-x-twitter"></i>
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
