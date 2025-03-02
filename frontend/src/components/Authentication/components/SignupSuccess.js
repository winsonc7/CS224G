import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const SignupSuccess = ({ onLoginClick }) => (
  <div className="auth-success-content">
    <div className="auth-success__icon">
      <CheckCircle2 size={48} color="#8b5cf6" />
    </div>
    <h3 className="auth-success__title">
      Successfully signed up!
    </h3>
    <p className="auth-success__message">
      Please check your email to verify your account.
    </p>
    <p className="auth-success__message">
      Once verified, you can log in.
    </p>
    <button 
      className="submit-btn"
      onClick={onLoginClick}
    >
      Go to Login
    </button>
  </div>
);

export default SignupSuccess;