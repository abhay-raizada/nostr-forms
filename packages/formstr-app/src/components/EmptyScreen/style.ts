import style from "styled-components";

export default style.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 208px);

  .empty-screen {
    height: 60%;
  }

  .no-data {
    text-align: center;
    font-size: 24px;
  }

  .add-form {
    align-self: center;
    width: 160px;
    margin: 8px;
  }
`;
