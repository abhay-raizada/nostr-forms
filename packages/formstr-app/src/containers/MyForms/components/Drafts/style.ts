import style from "styled-components";
import { MEDIA_QUERY_MOBILE } from "../../../../utils/css";

export default style.div`
  .edit-icon {
    text-decoration: none;
    color: black;
  }

  .action-icon {
    transition: transform 0.2s;
    cursor: pointer;
  }

  .action-icon:hover {
    color: #ff5733;
    transform: scale(1.3);
  }

  ${MEDIA_QUERY_MOBILE} {
    .action-icon {
      color: #ff5733;
    }
  }
`;
