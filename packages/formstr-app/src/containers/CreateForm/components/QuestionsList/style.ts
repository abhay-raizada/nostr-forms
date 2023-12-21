import styled from "styled-components";
import { MEDIA_QUERY_MOBILE_TABLET } from "../../utils/css";

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
    padding: 1em;
  }
  
  .desktop-add-btn {
    position: sticky;
    ${MEDIA_QUERY_MOBILE_TABLET} {
      display: none;
    }
  }
  .mobile-add-btn {
    display: none;
    ${MEDIA_QUERY_MOBILE_TABLET} {
      display: block;
      position: fixed;
      right: 10px;
      bottom: 50px;
      margin: 10px;
    }
  }
`;
