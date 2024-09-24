import styled from "styled-components";

export const Fake = styled.div`
  background-color: #DDD;
  height: ${props => props.height || 20}px;
`;

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
      max-width: 500px;

      .area--title {
        width: 200px;
        text-align: right;
        padding-right: 20px;
        font-weight: bold;
        font-size: 14px;
      }

      .area--input {
        flex: 1;

        input {
          width: 100%;
          font-size: 14px;
          padding: 5px;
          border: 1px solid #DDD;
          border-radius: 3px;
          outline: 0;
          transition: all ease .4s;

          &:focus {
            border: 1px solid #333;
            color: #333;
          }
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
          margin-bottom: 5px; 
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

export const OthersArea = styled.div`

  width: 100%;
  max-width: 800px;
  margin-top: 40px;

  h2 {
    font-size: 20px;
    color: #333;
    margin-top: 20px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .aditem {
      width: 25%;
    }
  }
    
  @media (max-width:600px) {
    & {
      gap: 10px;
      margin: auto;
    }

    .list .aditem {
      width: 100%;
      margin-bottom: 30px;
      min-height: 80px;
    }
  }
`;