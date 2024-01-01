import styled from "styled-components";

export default styled.div`
  .asterisk {
    transition: fill 0.2s ease-in-out;
    font-size: 12px;
    margin: 2.5px;
    height: 1em;
    width: 1em;
  }
  .asterisk:hover {
    fill: #ea8dea;
  }
  .asteriskSelected {
    fill: #ea8dea;
  }
  .action-wrapper {
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    padding-top: 5px;
  }

  .action-icon {
    padding-right: 5px;
    cursor: pointer;
  }
  .icon-svg {
    font-size: 12px;
  }
`;
