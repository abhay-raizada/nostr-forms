import styled from "styled-components";
import { MEDIA_QUERY_MOBILE } from "../../utils/css";

export default styled.div`
  display: flex;
  height: calc(100dvh - 67px);

  .my-forms-container {
    display: flex;
    flex-direction: column;
    align-content: space-between;
    align-items: stretch;
    width: calc(100vw - 242px);
    margin: 20px;
    height: 98%;

    div:last-of-type {
      margin-top: auto;
    }
  }

  .my-forms {
    width: 100%;
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .text-container {
    margin: 10px;
    display: flex;
    justify-content: end;
  }

  .text-style {
    color: #a8a29e;
    font-size: 14;
  }

  .sync-button {
    margin: 10px;
  }

  ${MEDIA_QUERY_MOBILE} {
    .my-forms-container {
      width: calc(100vw - 40px);
      margin: 20px;
    }
  }
`;
