import React, { useState } from 'react';
import { User, Smile, Calendar, Mail, Lock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import './Auth.css';

const PasswordRequirements = ({ validation, showMatching, isMatching }) => {
  const requirements = [
    {
      key: 'length',
      text: 'At least 8 characters',
      isValid: validation.length
    },
    {
      key: 'uppercase',
      text: 'One uppercase letter',
      isValid: validation.uppercase
    },
    {
      key: 'lowercase',
      text: 'One lowercase letter',
      isValid: validation.lowercase
    },
    {
      key: 'number',
      text: 'One number',
      isValid: validation.number
    },
    {
      key: 'special',
      text: 'One special character',
      isValid: validation.special
    }
  ];

  if (showMatching) {
    requirements.push({
      key: 'matching',
      text: 'Passwords match',
      isValid: isMatching
    });
  }

  return (
    <div className="password-requirements">
      {requirements.map(({ key, text, isValid }) => (
        <div key={key} className={`requirement ${isValid ? 'met' : 'unmet'}`}>
          {isValid ? (
            <CheckCircle2 size={14} className="requirement-icon success" />
          ) : (
            <XCircle size={14} className="requirement-icon error" />
          )}
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
};

const EmailRequirements = ({ validation }) => {
  const requirements = [
    {
      key: 'format',
      text: 'Valid email format',
      isValid: validation.format
    }
  ];

  return (
    <div className="email-requirements">
      {requirements.map(({ key, text, isValid }) => (
        <div key={key} className={`requirement ${isValid ? 'met' : 'unmet'}`}>
          {isValid ? (
            <CheckCircle2 size={14} className="requirement-icon success" />
          ) : (
            <XCircle size={14} className="requirement-icon error" />
          )}
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
};

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    preferredName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: ''
  });

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    matching: false
  });

  const [emailValidation, setEmailValidation] = useState({
    format: false,
    notEmpty: false
  });

  const validatePassword = (password, confirmPassword = formData.confirmPassword) => {
    setPasswordValidation({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      matching: confirmPassword ? password === confirmPassword : false
    });
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValidation({
      format: emailPattern.test(email),
      notEmpty: email.length > 0
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'password') {
      validatePassword(value);
    } else if (name === 'confirmPassword') {
      validatePassword(formData.password, value);
    } else if (name === 'email') {
      validateEmail(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isPasswordValid = Object.values(passwordValidation).every(value => value);
    const isEmailValid = Object.values(emailValidation).every(value => value);
    
    if (!isLogin && (!isPasswordValid || !isEmailValid)) {
      alert('Please ensure all requirements are met');
      return;
    }
    
    console.log('Form submitted:', formData);
  };

  return (
    <div className="app-container">
      <div className="auth-window">
        <h2 className="auth-title" key={isLogin ? 'login' : 'signup'}>
          {isLogin ? 'Welcome to Talk2Me' : 'Begin Your Journey'}
        </h2>
        <div className="auth-form-container">
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <>
                <div className="form-group">
                  <div className="input-with-icon">
                    <User size={20} className="input-icon" />
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-with-icon">
                    <Smile size={20} className="input-icon" />
                    <input
                      type="text"
                      id="preferredName"
                      name="preferredName"
                      value={formData.preferredName}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="What should we call you?"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="form-group">
              <div className="input-with-icon">
                <Mail size={20} className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your email"
                />
              </div>
              {!isLogin && formData.email && <EmailRequirements validation={emailValidation} />}
            </div>
            <div className="form-group">
              <div className="input-with-icon">
                <Lock size={20} className="input-icon" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                />
              </div>
              {!isLogin && <PasswordRequirements 
                validation={passwordValidation}
                showMatching={Boolean(formData.confirmPassword)}
                isMatching={passwordValidation.matching}
              />}
            </div>
            {!isLogin && (
              <>
                <div className="form-group">
                  <div className="input-with-icon">
                    <Lock size={20} className="input-icon" />
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-with-icon">
                    <Calendar size={20} className="input-icon" />
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              </>
            )}
            <button type="submit" className="submit-btn">
              {isLogin ? 'Log In' : 'Sign Up'}
            </button>
          </form>
        </div>
        <button 
          className="auth-toggle-btn"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : "Already have an account? Log in"}
        </button>
      </div>
    </div>
  );
}

export default Auth;