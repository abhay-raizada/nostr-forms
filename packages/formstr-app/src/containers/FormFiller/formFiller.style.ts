import styled from "styled-components";
import { MEDIA_QUERY_MOBILE } from "../../utils/css";
export default styled.div<{
  $isPreview?: boolean; // preciew true for preview tab
}>`
  .form-filler {
    background-color: #dedede;
    height: ${(props) =>
      props.$isPreview ? "calc(100vh - 112px)" : "calc(100vh - 56px)"};
    overflow: scroll;
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
    position: relative;
    height: 100vh;
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
