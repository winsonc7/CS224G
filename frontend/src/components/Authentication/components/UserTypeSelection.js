import React from 'react';
import { UserRound, HeartPulse } from 'lucide-react';

function UserTypeSelection({ onSelectUserType, onSwitchToLogin }) {
  return (
    <>
      <div className="user-type-selection">
        <div 
          className="user-type-option"
          onClick={() => onSelectUserType('client')}
        >
          <UserRound size={48} />
          <h3>I'm seeking therapy</h3>
          <p>Find a therapist and start your mental health journey</p>
        </div>
        
        <div 
          className="user-type-option"
          onClick={() => onSelectUserType('therapist')}
        >
          <HeartPulse size={48} />
          <h3>I'm a therapist</h3>
          <p>Create a profile and connect with clients who need your help</p>
        </div>
      </div>
      
      <button 
        className="auth-toggle-btn"
        onClick={onSwitchToLogin}
      >
        Already have an account? Log in
      </button>
    </>
  );
}

export default UserTypeSelection; 