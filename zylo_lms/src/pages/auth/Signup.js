import React, { useState } from 'react';
import './Signup.css';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import logo from "../../Images/crtlogo-removebg-preview.png";
import logo1 from "../../Images/lms-bac7-removebg-preview.png";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!role) {
      setError("Please select a role.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save role and other details in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
        createdAt: new Date()
      });

      alert("Signup successful! Welcome to Zylo Tech.");

      if (role === 'student') {
        navigate('/student-dashboard');
      } else if (role === 'instructor') {
        navigate('/InstructorDashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper-3d">
      <div className="auth-card-3d">
        <div className="auth-left-3d d-none d-md-flex">
          <div className="text-zone">
            <h2>Join Zylo Tech Today!</h2>
            <p>Unlock premium content, expert mentorship, and more!</p>
            <img src={logo1} alt="Tech Illustration" className="illu-img" style={{ maxHeight: '240px' }} />
          </div>
        </div>
        <div className="auth-right-3d">
          <div className="logo-box text-center mb-3">
            <img src={logo} alt="Logo" height={75} />
            <h3 style={{ fontWeight: "bold" }} className="mb-1">Create your Zylo Tech Account</h3>
            <p style={{ color: "black", fontSize: "14px", marginBottom: "10px", fontWeight: "bolder" }}>
              Sign up and start learning
            </p>
          </div>

          {error && <div className="error-text" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

          <form onSubmit={handleSignup}>
            <input
              type="email"
              className="auth-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="custom-input-wrapper">
              <span className="input-icon">
                <i className="fas fa-user-tag"></i>
              </span>
              <select
                className="auth-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Signing Up...' : 'Sign Up →'}
            </button>

            <div className="signup-link text-center">
              <small style={{ color: "black" }}>
                Already have an account? <Link to="/">Login</Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
