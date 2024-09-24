import styled from "styled-components";

export const Confirm = styled.div`

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
};

.modal-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  max-width: 90%;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
};

.modal-button {
  background: ${props => props.primary ? '#007bff' : '#6c757d'};
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 5px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  
  };
  &:hover {
    background-color: ${props => props.primary ? '#0056b3' : '#5a6268'};
    opacity: 1;
  }
`;
