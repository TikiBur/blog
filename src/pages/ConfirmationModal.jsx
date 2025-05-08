import React, { useRef, useEffect } from 'react';
import '../styles/global.css';

const ConfirmationModal = ({ onConfirm, onCancel, triggerElementId }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const positionModal = () => {
      if (modalRef.current) {
        const trigger = document.getElementById(triggerElementId);
        if (trigger) {
          const rect = trigger.getBoundingClientRect();
          modalRef.current.style.top = `${rect.bottom + window.scrollY}px`;
          modalRef.current.style.right = `${window.innerWidth - rect.right}px`;
        }
      }
    };

    positionModal();
    window.addEventListener('resize', positionModal);
    
    return () => {
      window.removeEventListener('resize', positionModal);
    };
  }, [triggerElementId]);

  return (
    <div className="modal-overlay">
      <div className="delete-confirmation-modal" ref={modalRef}>
        <div className="modal-arrow"></div>
        <div className="errclass">
          <span className='err'>!</span>
          <h3>Are you sure to delete this article?</h3>
        </div>
        <div className="modal-buttons">
          <button onClick={onCancel} className="cancel-button">No</button>
          <button onClick={onConfirm} className="confirm-button">Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;