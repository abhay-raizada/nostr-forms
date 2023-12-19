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
    overflow: hidden;
  }

  .form-description {
    text-align: left;
    padding: 32px;
  }
`;
