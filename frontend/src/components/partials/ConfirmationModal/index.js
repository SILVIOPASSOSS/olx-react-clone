import React, { useState } from 'react';
import { Confirm } from './styled';

const ConfirmationModal = ({ show, onConfirm, onCancel}) => {
  if (!show) return null;

  const handleOverlayClick = (e) => {
    // Fecha o modal se o clique for na camada de overlay
    if (e.target.classList.contains('modal-overlay')) {
      onCancel();
    }
  };

  return (
    <Confirm className="aditem">
      <div className='modal-overlay' onClick={handleOverlayClick}>
        <div className='modal-container'>
          <h2>Confirmação</h2>
          <p>Tem certeza de que deseja excluir este anúncio?</p>
          <div>
            <button className='modal-button' onClick={onCancel}>Cancelar</button>
            <button className='modal-button' primary onClick={onConfirm}>Confirmar</button>
          </div>
        </div>
      </div>
    </Confirm>
  );
};

export default ConfirmationModal;