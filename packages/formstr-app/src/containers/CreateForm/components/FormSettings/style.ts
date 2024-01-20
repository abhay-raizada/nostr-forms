import styled from "styled-components";

export default styled.div`
  background-color: white;
  .divider {
    margin: 0;
  }

  .form-setting {
    margin: 16px;
  }

  .property-setting {
    display: flex;
    justify-content: space-between;
    margin: 12px 0;
    font-size: 14px;
  }

  .file-input {
    border: 1px solid #dedede;
    border-radius: 10px;
    padding: 10px;
  }

  .file-input:focus {
    outline: none;
    border: 1px solid #dedede;
    box-shadow: 0 0 10px #f00;
    border-radius: 10px;
  }

  .npub-list {
    list-style: circle;
  }

  .npub-list-text {
    font-size: 12px;
    font-weight: normal;
  }
`;
