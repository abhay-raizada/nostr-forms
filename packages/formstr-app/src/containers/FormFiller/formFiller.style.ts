import styled from "styled-components";
import { MEDIA_QUERY_MOBILE } from "../../utils/css";

export default styled.div`
  position: relative;
  height: calc(100vh - 48px);
  overflow: scroll;

  .form-filler {
    background-color: #dedede;
    padding-left: 32px;
    padding-right: 32px;
    overflow: scroll;
    width: 60%;
    margin: 0 auto 0 auto;
    ${MEDIA_QUERY_MOBILE} {
      width: 100%;
      padding: 0;
    }
  }

  .filler-container {
    width: 100%;
    background-color: #dedede;
  }

  .form-title {
    position: relative;
    height: 250px;
    background-color: #ff5733;
    border-radius: 10px;
    margin-top: 30px;
    overflow: hidden;
  }

  .filler-question {
    max-width: "100%";
    margin: "5px";
    text-align: "left";
  }

  .form-description {
    text-align: left;
    padding: 1em;
  }
`;
