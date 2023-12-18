import styled from "styled-components";
import { MEDIA_QUERY_MOBILE_TABLET } from "./utils/css";

export default styled.div<{$isOpen?: boolean}>`
  .left-sidebar {
    ${MEDIA_QUERY_MOBILE_TABLET} {
        display: ${props => props.$isOpen ? 'block':'none'};
        box-shadow: 3px 1px 5px -3px gray;
    }
  }

  .main-content {
    ${MEDIA_QUERY_MOBILE_TABLET} {
        width: 100%;
        padding:0;
        position: ${props => props.$isOpen ? 'absolute':'static'};
        z-index: ${props => props.$isOpen ? '-1':'0'};
        opacity: ${props => props.$isOpen ? '0.5':'1'};
    }
  }

  .right-sidebar {
    ${MEDIA_QUERY_MOBILE_TABLET} {
        display: none
    }
  }
`;
