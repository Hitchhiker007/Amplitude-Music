import React from 'react';

const Modal = ({ isOpen, onClose, children}) => {
    if (!isOpen) return null;

   return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button 
          onClick={onClose}
          className="modal-close"
          aria-label="Close Modal"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
