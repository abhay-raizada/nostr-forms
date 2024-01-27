import styled from "styled-components";

export default styled.div`
  .form-details {
    display: flex;
    align-items: center;
    text-align: center;
    flex-direction: column;
    word-break: break-all;
  }

  .form-details-card {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  .settings-container {
    display: flex;
    justify-content: center;
    width: 50%;
  }

  .settings-item {
    padding: 5px;
  }

  .embedded-share {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-content: center;
    justify-content: center;
  }

  .embedded-code {
    width: 50%;
  }
  .ant-checkbox {
    margin-bottom: 4px;
    /* Add your styles here */
  }

  .embed-container {
    border: 1px solid black;
    background-color: lightgray;
    width: 60%;
  }
`;
