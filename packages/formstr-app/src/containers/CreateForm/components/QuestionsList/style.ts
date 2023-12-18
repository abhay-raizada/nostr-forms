import styled from "styled-components";

export default styled.div`
  background-color: #dedede;
  padding-left: 32px;
  padding-right: 32px;
  overflow: scroll;
  height: calc(100vh - 112px);
  width: calc(100vw - 456px);

  .cover-image {
    background-image: linear-gradient(
        180deg,
        rgb(243 239 239 / 0%),
        rgb(4 3 3) 150%
      ),
      url("https://upload.wikimedia.org/wikipedia/commons/9/9c/Siberian_Husky_pho.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 250px;
    margin-top: 30px;
    border-radius: 10px;
    position: relative;
  }

  .cover-image-text {
    color: white;
    position: absolute;
    bottom: 10px;
    left: 10px;
    font-size: 24px;
  }

  .form-description {
    text-align: left;
    padding: 32px;
  }
`;
