// components/Authentication/components/LegalDisclaimerModal.js
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import ClientDisclaimer from './disclaimers/ClientDisclaimer';
import TherapistDisclaimer from './disclaimers/TherapistDisclaimer';

const LegalDisclaimerModal = ({ isOpen, onClose, onAccept, userType = 'client' }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef(null);
  const modalRef = useRef(null);
  
  // Reset scroll state when modal opens
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      
      // Focus trap and click outside to close
      const handleClickOutside = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleScroll = () => {
    if (!contentRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    // Check if scrolled near bottom (with a 30px buffer)
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 30;
    
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  // Get the title based on user type
  const getTitle = () => {
    return userType === 'therapist' 
      ? 'Therapist Terms and Conditions'
      : 'Terms and Conditions';
  };

  // Render the appropriate disclaimer based on user type
  const renderDisclaimer = () => {
    return userType === 'therapist' 
      ? <TherapistDisclaimer />
      : <ClientDisclaimer />;
  };

  if (!isOpen) return null;

  return (
    <div className="legal-modal-overlay">
      <div className="legal-modal" ref={modalRef}>
        <div className="legal-modal-header">
          <h3>{getTitle()}</h3>
          <button 
            type="button"
            className="close-modal-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        
        <div 
          className="legal-modal-content"
          ref={contentRef}
          onScroll={handleScroll}
        >
          <div className="legal-text">
            {renderDisclaimer()}
          </div>
        </div>
        
        <div className="legal-modal-footer">
          {!hasScrolledToBottom && (
            <div className="scroll-indicator">
              Please scroll to read all terms
            </div>
          )}
          <div className="modal-actions">
            <button 
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="button"
              className="modal-accept-btn"
              onClick={onAccept}
              disabled={!hasScrolledToBottom}
            >
              I Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimerModal;