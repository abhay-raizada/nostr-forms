import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import CopyStyle from "./copy.style";

export const CopyButton = ({
  getText,
  textBefore,
  textAfter,
}: {
  getText: () => string;
  textBefore?: string;
  textAfter?: string;
}) => {
  console.log("Got PRops", textAfter, textBefore);
  const [copyMessage, setCopyMessage] = useState<
    "Copy" | "Copied!" | "Error!" | string
  >(textBefore === undefined ? "Copy" : textBefore);
  console.log(
    "textbefore === undefinded",
    textBefore === undefined,
    textBefore
  );
  const copyText = () => {
    navigator.clipboard.writeText(getText()).then(
      (resolve) => {
        setCopyMessage(textAfter === undefined ? "Copied!" : textAfter);
      },
      (reject) => {
        setCopyMessage("Error!");
      }
    );
    setTimeout(() => {
      setCopyMessage(textBefore === undefined ? "Copy" : textBefore);
    }, 5000);
  };
  return (
    <CopyStyle>
      <label className="copy-label">{copyMessage}</label>
      <Button
        disabled={copyMessage === "Copied!"}
        icon={
          copyMessage === "Copied!" ? <CheckCircleOutlined /> : <CopyOutlined />
        }
        onClick={copyText}
        style={{ marginTop: -5 }}
      />
    </CopyStyle>
  );
};
