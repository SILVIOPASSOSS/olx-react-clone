import styled from "styled-components";

export const PageArea = styled.div`
  form {
    background-color: white;
    border-radius: 3px;
    padding: 10px;
    box-shadow: 0px 0px 3px #999;

    .area {
      display: flex;
      align-items: center;
      padding: 10px;
      justify-content: center; /* Centraliza as áreas horizontalmente */
      width: 100%; /* Garante que a área ocupe toda a largura */
      max-width: 600px; /* Define um limite de largura para não exagerar em telas grandes */
      margin: 0 auto; /* Centraliza o formulário na página */

      .area--title {
        width: 200px;
        text-align: right;
        padding-right: 20px;
        font-weight: bold;
        font-size: 14px;
      }

      .area--input {
        flex:1;

        input, select, textarea {
          width: 100%;
          font-size: 14px;
          padding: 5px;
          border:1px solid #DDD;
          border-radius: 3px;
          outline: 0;
          transition: all ease .4s;

          &:focus {
            border: 1px solid #333;
            color: #333;
          }
        }
        
        textarea {
          height: 150px;
          resize:none;
        }
        
        button {
          background-color: #0089FF;
          border: 0;
          outline: 0;
          padding: 5px 10px;
          border-radius: 5px;
          color: #FFF;
          font-size: 15px;
          cursor: pointer;
          margin-top:10px;

          &:hover {
            background-color: #006FCE;
          }
        }
      }
    }
  }

  @media (max-width:600px) {
    form {
      .area {
        flex-direction: column;
        align-items: center;
        text-align: center;
        width: 100%;
    
        .area--title {
          width: 100%;
          text-align: left;
          margin-bottom: 5px: 
        }

        .area--input {
          width: 100%;

          input, select, textarea, button {
            width: 100%;
          }

          button {
            padding: 10px;
            margin-top: 10px;
          }
        }
      }
    }
  }
`;