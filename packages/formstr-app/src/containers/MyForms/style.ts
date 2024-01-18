import styled from "styled-components";
import { MEDIA_QUERY_MOBILE } from "../../utils/css";

export default styled.div`
  display: flex;

  .my-forms {
    width: calc(100vw - 242px);
    margin: 20px;
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
  }

  .sync-button {
    margin: 10px;
  }

  ${MEDIA_QUERY_MOBILE} {
    .my-forms {
      width: calc(100vw - 40px);
      margin: 20px;
    }
  }
`;
