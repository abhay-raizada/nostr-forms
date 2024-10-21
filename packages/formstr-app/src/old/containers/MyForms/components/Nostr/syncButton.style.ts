import styled from "styled-components";
import { MEDIA_QUERY_MOBILE } from "../../../../../utils/css";

export default styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  ${MEDIA_QUERY_MOBILE} {
    left: 25%;
  }
`;
