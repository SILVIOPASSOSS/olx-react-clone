import styled from "styled-components";

export const SearchArea = styled.div`
  background-color: #DDD;
  border-bottom: solid #CCC;
  padding: 20px 0;

  .searchBox {
    background-color: #9BB83C;
    padding: 20px 15px;
    border-radius: 5px;
    box-shadow: 1px 1px 0.3px rgba(0,0,0,0.2);
    display: flex;

    form {
      flex: 1;
      display: flex;

      input, select {
        color: #000;
        height: 40px;
        border: none;
        border-radius: 5px;
        outline: none;
        font-size: 15px;
        margin-right: 20px;
      }
      
      input {
        flex: 1;
        padding: 0 10px;
      }
      
      select {
        width: 100px;
      }

      button {
        background-color: #49AEEF;
        font-size: 15px;
        border: none;
        border-radius: 5px;
        color: #FFF;
        height: 40px;
        padding: 0 20px;
        cursor: pointer;
      }
    }
  }
  
  .categoryList {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    justify-content: space-around;

    .categoryItem {
      width: 20%;
      display: flex;
      align-items: center;
      color: #000;
      text-decoration: none;
      height: 50px;
      margin-bottom: 10px;
      transition: color .2s ease-in-out;

      &:hover {
        color: #999;
      }

      img {
        width: 45px;
        height: 45px;
        margin-right: 10px;
      }
    }
  }

  @media (max-width:600px) {

    .searchBox form {
      flex-direction: column;

      input {
        padding: 10px;
        margin-right: 0;
        margin-bottom: 10px;
      }

      select {
        width: 100%;
        margin-bottom: 10px;
      }
    }

    .categoryList .categoryItem {
      width: 50%;
      padding: 15px;
    }
  }
`;  

export const PageArea = styled.div`
  h2 {
    font-size:20px;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    .aditem {
      width: 23%;
      height: 200px;
      margin: 10px;
    }
  }

  .seeAllLink {
    color: #000;
    text-decoration: none;
    font-weight: bold;
    display: inline-block;
    margin-top: 10px;
  }

  @media (max-width:600px) {
    & {
      margin: 10px;
    }
    .list .aditem{
      width: 50%;
      margin: 0;
    }
  }
`;