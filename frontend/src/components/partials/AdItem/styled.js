import styled from "styled-components";

export const Item = styled.div`
  a {
    display: flex; /* Usando flexbox para organizar layout */
    flex-direction: column; /* Coloca os filhos em coluna */
    justify-content: space-between; /* Espaça os itens */
    border: 1px solid #FFF;
    margin: 10px;
    text-decoration: none;
    padding: 10px;
    border-radius: 5px;
    color: #000;
    background-color: #FFF;
    transition: all ease .2s;
    height: 100%;

    &:hover {
      background-color: #EEE;
      border: 1px solid #CCC;
    }

    .itemImage {
      width: 100%;
      height: 200px; /* Altura fixa para as imagens */
      overflow: hidden; /* Adicionado para esconder parte da imagem que excede o tamanho da div */

      img {
        width: 100%;
        height: 100%; /* Ocupar toda a altura disponível da div itemImage */
        object-fit: cover; /* Ajusta a imagem para cobrir toda a área da div */
        border-radius: 5px;
        background-color: #000;
      }
    }

    .itemName {
      font-weight: bold;
      margin-top: 10px; /* Espaço entre a imagem e o texto */
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px; /* Espaço entre os botões */

  button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:nth-child(1) { /* Primeiro botão (Editar) */
      background-color: #4CAF50; /* Verde */
      color: white;

      &:hover {
        background-color: #45a049;
      }
    }

    &:nth-child(2) { /* Segundo botão (Excluir) */
      background-color: #f44336; /* Vermelho */
      color: white;

      &:hover {
        background-color: #d32f2f;
      }
    }
  }
`;
