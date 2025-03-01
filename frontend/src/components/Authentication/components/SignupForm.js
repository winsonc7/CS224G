// components/Authentication/components/SignupForm.js
import React from 'react';
import { User, Smile, Calendar, Mail, Lock, Briefcase, Building, ArrowLeft } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useAuthForm } from '../hooks/useAuthForm';
import FormField from './FormField';
import LegalCheckbox from './LegalCheckbox';

function SignupForm({ onSwitchToLogin, onSignupSuccess, userType = 'client', onBackToUserTypeSelection }) {
  const { signUp } = useAuth();
  
  const form = useAuthForm(false, {
    onSignUpSuccess: onSignupSuccess,
    signUp,
    userType
  });
  
  // Render therapist-specific fields if userType is therapist
  const renderTherapistFields = () => {
    if (userType !== 'therapist') return null;
    
    return (
      <>
        <FormField
          icon={Briefcase}
          placeholder="Your credentials (e.g., PhD, LMFT)"
          error={form.errors.credentials}
          registration={form.register('credentials')}
        />
        
        <FormField
          icon={Building}
          placeholder="Your practice or organization"
          error={form.errors.practice}
          registration={form.register('practice')}
        />
      </>
    );
  };
  
  return (
    <>
      <form onSubmit={form.handleSubmit} className="auth-form">
        <FormField
          icon={User}
          placeholder="Enter your full name"
          error={form.errors.fullName}
          registration={form.register('fullName')}
        />
        
        <FormField
          icon={Smile}
          placeholder="What should we call you?"
          registration={form.register('preferredName')}
        />
        
        {renderTherapistFields()}
        
        <div className="form-field-wrapper">
          <FormField
            icon={Mail}
            type="email"
            placeholder="Enter your email"
            error={form.errors.email}
            registration={form.register('email')}
          />
        </div>

        <FormField
          icon={Lock}
          type="password"
          placeholder="Enter your password"
          error={form.errors.password}
          registration={form.register('password')}
        />

        <FormField
          icon={Lock}
          type="password"
          placeholder="Confirm your password"
          error={form.errors.confirmPassword}
          registration={form.register('confirmPassword')}
        />
        
        <FormField
          icon={Calendar}
          type="date"
          error={form.errors.dateOfBirth}
          registration={form.register('dateOfBirth')}
          max={new Date().toISOString().split('T')[0]}
        />

        <LegalCheckbox 
          register={form.register} 
          error={form.errors.disclaimer}
          setValue={form.setValue}
          userType={userType}
        />

        {form.error && (
          <div className="auth-error">
            <p>{form.error}</p>
          </div>
        )}

        <button 
          type="submit" 
          className="submit-btn"
          disabled={form.isSubmitting}
        >
          {form.isSubmitting 
            ? 'Processing...' 
            : 'Sign Up'
          }
        </button>
      </form>
      
      <div className="auth-links">
        <button 
          className="auth-toggle-btn"
          onClick={onSwitchToLogin}
        >
          Already have an account? Log in
        </button>
        
        {onBackToUserTypeSelection && (
          <button 
            type="button"
            className="auth-toggle-btn back-link"
            onClick={onBackToUserTypeSelection}
          >
            <ArrowLeft size={14} />
            <span>Back to user type selection</span>
          </button>
        )}
      </div>
    </>
  );
}

export default SignupForm;