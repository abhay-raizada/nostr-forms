import { Button, Modal, Spin } from "antd";
import { CheckCircleTwoTone } from "@ant-design/icons";
import { useState } from "react";

export const SignAndSubmit = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pubKeyAccess, setPubKeyAccess] = useState(false);
  const [responseEncrypted, setResponseEncrypted] = useState(false);
  const [signedEvent, setSignedEvent] = useState(false);

  function showModal(event) {
    props.onSubmit(
      event,
      true,
      onReadPubkey,
      onEncryptedResponse,
      onEventSigned
    );
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function onReadPubkey(pubkey) {
    setPubKeyAccess(true);
  }

  function onEncryptedResponse() {
    setResponseEncrypted(true);
  }

  function onEventSigned() {
    setSignedEvent(true);
    setIsModalOpen(false);
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        {props.edit ? "Edit and submit" : "Sign and submit"}
      </Button>
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
