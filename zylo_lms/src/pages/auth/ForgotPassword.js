import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent!');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Forgot Password</h2>
      <form onSubmit={handleReset}>
        <input type="email" className="form-control my-2" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="btn btn-dark w-100" type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
