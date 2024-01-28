import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import CopyStyle from "./copy.style";

export const CopyButton = ({ getText }: { getText: () => string }) => {
  const [copyMessage, setCopyMessage] = useState<"Copy" | "Copied!" | "Error!">(
    "Copy"
  );
  const copyText = () => {
    navigator.clipboard.writeText(getText()).then(
      (resolve) => {
        setCopyMessage("Copied!");
      },
      (reject) => {
        setCopyMessage("Error!");
      }
    );
    setTimeout(() => {
      setCopyMessage("Copy");
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
      />
    </CopyStyle>
  );
};
