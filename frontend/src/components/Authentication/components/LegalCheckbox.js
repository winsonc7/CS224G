// components/Authentication/components/LegalCheckbox.js
import React, { useState } from 'react';
import { Check, FileText } from 'lucide-react';
import LegalDisclaimerModal from './LegalDisclaimerModal';

const LegalCheckbox = ({ register, error, setValue, userType = 'client' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);

  const openModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAccept = () => {
    setHasAccepted(true);
    setValue('disclaimer', true, { shouldValidate: true });
    setIsModalOpen(false);
  };

  // Handle direct checkbox click (allows toggling)
  const handleCheckboxChange = (e) => {
    if (!hasAccepted && e.target.checked) {
      // If trying to check without reading terms, open modal
      e.preventDefault();
      openModal(e);
    } else if (hasAccepted && !e.target.checked) {
      // Allow unchecking directly
      setHasAccepted(false);
      setValue('disclaimer', false, { shouldValidate: true });
    }
  };

  // Determine the label text based on user type
  const getLabelText = () => {
    return userType === 'therapist' 
      ? 'I agree to the Therapist Terms and Conditions'
      : 'I agree to the Terms and Conditions';
  };

  return (
    <div className="form-group disclaimer-group">
      <div className="disclaimer-row">
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="disclaimer"
            className={`agreement-checkbox ${error ? 'error' : ''}`}
            checked={hasAccepted}
            onChange={handleCheckboxChange}
            {...register('disclaimer')}
            onClick={(e) => {
              if (!hasAccepted && !isModalOpen) {
                e.preventDefault();
                openModal(e);
              }
            }}
          />
          <label 
            htmlFor="disclaimer"
            className="disclaimer-label"
          >
            {getLabelText()}
          </label>
        </div>
        
        <button 
          type="button"
          className="view-terms-btn"
          onClick={openModal}
        >
          <FileText size={16} />
          <span>View Terms</span>
        </button>
      </div>
      
      {error && (
        <span className="error-message">
          {error.message}
        </span>
      )}
      
      {hasAccepted && (
        <div className="terms-accepted">
          <Check size={14} className="check-icon" />
          <span>Terms accepted</span>
        </div>
      )}
      
      <LegalDisclaimerModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        onAccept={handleAccept}
        userType={userType}
      />
    </div>
  );
};

export default LegalCheckbox;