import styled from "styled-components";

export default styled.div`
  background-color: #dedede;
  padding-left: 32px;
  padding-right: 32px;
  overflow: scroll;
  height: calc(100vh - 112px);
  width: calc(100vw - 482px);

  .form-title {
    position: relative;
    height: 250px;
    background-color: #ff5733;
    border-radius: 10px;
    margin-top: 30px;
  }

  .title-image {
    height: 250px;
    width: 100%;
    border-radius: 10px;
  }

  .title-text {
    color: white;
    position: absolute;
    bottom: 10px;
    left: 16px;
    font-size: 24px;
  }

  .image-utils {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
  }

  .icon-util {
    display: flex;
    justify-content: center;
    margin-left: 12px;
    width: 32px;
    height: 32px;
    background-color: lightgrey;
    border-radius: 16px;
    opacity: 0.5;
    cursor: pointer;
  }

  .form-description {
    text-align: left;
    padding: 32px;
  }

  .file-input {
    display: none;
  }
`;
