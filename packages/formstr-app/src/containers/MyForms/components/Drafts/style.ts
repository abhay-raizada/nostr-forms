import style from "styled-components";

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
`;
