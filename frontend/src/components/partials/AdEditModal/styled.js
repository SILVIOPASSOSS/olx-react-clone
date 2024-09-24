import styled from "styled-components";

export const Item = styled.div`
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    width: 500px;
    max-width: 90%;
    max-height: 80vh; /* Limita a altura máxima do modal */
    overflow-y: auto; /* Adiciona rolagem vertical se o conteúdo exceder a altura */
    position: relative; /* Para o botão fechar */
    z-index: 1001;
  }

  .modal-content {
    background-color: #FFF;
    padding: 20px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  
  h2 {
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
    text-align: center;
  }

  label {
    font-size: 14px;
    margin-bottom: 5px;
    color: #555;
    display: block;
  }

  input[type="text"],
  input[type="number"],
  input[type="file"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 15px;
    font-size: 16px;
  }

  button {
    background-color: #007bff;
    color: #fff;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
    width: 100%;
  }

  button:hover {
    background-color: #0056b3;
  }

  .close {
    font-size: 24px;
    cursor: pointer;
    position: absolute;
    top: 15px;
    right: 20px;
  }

  .existing-images {
    display: flex;
    flex-wrap: wrap;

    div {
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;

      img {
        width: 100px;
        height: 100px;
        object-fit: cover;
        border-radius: 5px;
        border: 1px solid #ddd;
      }

      .remove-btn {
        position: absolute;
        top: 3px;
        right: 3px;
        background-color: transparent;
        border: none;
        cursor: pointer;
        padding: 2px

        svg {
          fill: red;
          width: 14px;
          height: 14px;
        }
        &:hover {
          svg {
            fill: darkred;
          }
        }
      }
    }

    }

  @media (max-width: 768px) {
    .modal {
      width: 90%;
      padding: 15px;
    }

    input[type="text"],
    input[type="number"] {
      font-size: 14px;
    }

    button {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
`;
