import { CheckCircleTwoTone, DownOutlined } from "@ant-design/icons";
import { Dropdown, Modal, Spin, MenuProps } from "antd";
import React, { useState } from "react";

type onSubmitFunction = (...args: unknown[]) => void;

interface SubmitButtonProps {
  selfSign: boolean;
  edit: boolean;
  onSubmit: onSubmitFunction;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  selfSign,
  edit,
  onSubmit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pubKeyAccess, setPubKeyAccess] = useState(false);
  const [responseEncrypted, setResponseEncrypted] = useState(false);
  const [signedEvent, setSignedEvent] = useState(false);

  const showModal = () => {
    onSubmit(null, true, onReadPubkey, onEncryptedResponse, onEventSigned);
    setIsModalOpen(true);
  };

  function closeModal() {
    setIsModalOpen(false);
  }

  function onReadPubkey() {
    setPubKeyAccess(true);
  }

  function onEncryptedResponse() {
    setResponseEncrypted(true);
  }

  function onEventSigned() {
    setSignedEvent(true);
    setIsModalOpen(false);
  }

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "signSubmition") {
      showModal();
    } else {
      onSubmit();
    }
  };

  const handleButtonClick = () => {
    if (selfSign) {
      showModal();
      return;
    }
    onSubmit();
  };
  const items = [
    {
      label: "Submit Anonymously",
      key: "submit",
      disabled: selfSign,
    },
    {
      label: edit ? "Update Response" : "Submit As Yourself",
      key: "signSubmition",
    },
  ];

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <Dropdown.Button
        menu={menuProps}
        type="primary"
        onClick={handleButtonClick}
        icon={<DownOutlined />}
      >
        {selfSign
          ? edit
            ? "Update Response"
            : items[1].label
          : items[0].label}
      </Dropdown.Button>
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        title="Nip-07 browser extension needed to sign"
      >
        {pubKeyAccess && (
          <div>
            {" "}
            <CheckCircleTwoTone /> Got Access to pubkey
          </div>
        )}
        {!pubKeyAccess && (
          <div>
            <Spin size="small" /> Getting pubkey access
          </div>
        )}
        {responseEncrypted && (
          <div>
            {" "}
            <CheckCircleTwoTone /> Your response is encrypted
          </div>
        )}
        {!responseEncrypted && (
          <div>
            <Spin size="small" /> Encrypting your response
          </div>
        )}
        {signedEvent && (
          <div>
            {" "}
            <CheckCircleTwoTone />
            Your response is now signed
          </div>
        )}
        {!signedEvent && (
          <div>
            <Spin size="small" /> Signing your response
          </div>
        )}
      </Modal>
    </>
  );
};
