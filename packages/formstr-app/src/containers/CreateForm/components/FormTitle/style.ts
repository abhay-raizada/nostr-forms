import styled from "styled-components";

export default styled.div<{ titleImageUrl?: string }>`
  ${({ titleImageUrl }) => {
    return (
      titleImageUrl &&
      `
    background-image: linear-gradient(180deg, rgb(243 239 239 / 0%), rgb(4 3 3) 150%), url(${titleImageUrl});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    `
    );
  }}

  .title-text {
    color: white;
    position: absolute;
    bottom: 10px;
    left: 16px;
    font-size: 24px;
  }

  .image-utils {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
  }

  .icon-util {
    display: flex;
    justify-content: center;
    margin-left: 12px;
    width: 32px;
    height: 32px;
    background-color: lightgrey;
    border-radius: 16px;
    opacity: 0.5;
    cursor: pointer;
  }
`;
