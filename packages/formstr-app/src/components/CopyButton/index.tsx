import { CheckCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import CopyStyle from "./copy.style";

export const CopyButton = ({ getText }: { getText: () => string }) => {
  const [copied, setCopied] = useState(false);
  const copyText = () => {
    navigator.clipboard.writeText(getText());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <CopyStyle>
      <label className="copy-label">Copy</label>
      <Button
        disabled={copied}
        icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
        onClick={copyText}
      />
    </CopyStyle>
  );
};
