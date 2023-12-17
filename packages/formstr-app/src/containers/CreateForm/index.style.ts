import styled from "styled-components";
import { MEDIA_QUERY_MOBILE_TABLET } from "./utils/css";

export default styled.div<{$isOpen?: boolean}>`
  .left-sidebar {
    ${MEDIA_QUERY_MOBILE_TABLET} {
        display: ${props => props.$isOpen ? 'block':'none'};
        width: 100%;
    }
  }

  .main-content {
    ${MEDIA_QUERY_MOBILE_TABLET} {
        width: 100%;
        padding:0;
        display: ${props => props.$isOpen ?'none': 'block'};

    }
  }

  .right-sidebar {
    ${MEDIA_QUERY_MOBILE_TABLET} {
        display: none
    }
  }
`;
