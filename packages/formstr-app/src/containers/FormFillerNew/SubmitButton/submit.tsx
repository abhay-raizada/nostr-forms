import { CheckCircleTwoTone, DownOutlined, LoadingOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Modal, Spin, Button, FormInstance, Dropdown, MenuProps, Alert } from "antd";
import React, { useState } from "react";

interface SubmitButtonProps {
  selfSign: boolean | undefined;
  edit: boolean;
  form: FormInstance;
  onSubmit: (anonymous: boolean) => Promise<void>;
  disabled?: boolean;
  disabledMessage?: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  selfSign,
  edit,
  form,
  onSubmit,
  disabled = false,
  disabledMessage = "disabled",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionType, setSubmissionType] = useState<'anonymous' | 'signed'>('anonymous');

  const signAndSubmit = async () => {
    try {
      await submitForm(false);
    } finally {
      setIsSigning(false);
      closeModal();
    }
  };

  const submitForm = async (anonymous: boolean = true) => {
    setIsSubmitting(true);
    try {
      await form.validateFields();
      let errors = form.getFieldsError().filter((e) => e.errors.length > 0);
      if (errors.length === 0) {
        await onSubmit(anonymous);
      }
    } catch (err) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const showModal = () => {
    setIsSigning(true);
    setIsModalOpen(true);
    signAndSubmit();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleConfirm = async () => {
    if (submissionType === 'signed') {
      showModal();
    } else {
      await submitForm(true);
    }
    closeConfirmModal();
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSubmissionType(e.key === "signSubmition" ? 'signed' : 'anonymous');
    setShowConfirmModal(true);
  };

  const handleButtonClick = () => {
    setSubmissionType(selfSign ? 'signed' : 'anonymous');
    setShowConfirmModal(true);
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

  const getConfirmModalText = () => {
    if (edit) {
      return submissionType === 'signed' 
        ? "Are you sure you want to update this response?" 
        : "Are you sure you want to update this response anonymously?";
    }
    return submissionType === 'signed'
      ? "Are you sure you want to submit this response?"
      : "Are you sure you want to submit this response anonymously?";
  };

  return (
    <>
      <Dropdown.Button
        menu={menuProps}
        type="primary"
        onClick={handleButtonClick}
        icon={<DownOutlined />}
        disabled={disabled || isSubmitting}
        className="submit-button"
      >
        {disabled ? (
          disabledMessage
        ) : isSubmitting ? (
          <span>
            <LoadingOutlined className="mr-2" />
            Submitting...
          </span>
        ) : (
          selfSign ? items[1].label : "Submit"
        )}
      </Dropdown.Button>

      {/* Confirm Modal */}
      <Modal
        title="Confirm Submission"
        open={showConfirmModal}
        onCancel={closeConfirmModal}
        footer={[
          <Button key="back" onClick={closeConfirmModal}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleConfirm}
          >
            Confirm
          </Button>,
        ]}
      >
        <p>{getConfirmModalText()}</p>
        {submissionType === 'signed' && (
          <Alert
            message="Login Required"
            description={
              <span>
                You'll need to sign this submission using a Nip-07 browser extension.{" "}
                <a
                  href="https://nostrcheck.me/register/browser-extension.php"
                  target="_blank"
                  rel="noreferrer"
                >
                  Click here
                </a>{" "}
                to learn more about Nip-07 signing.
              </span>
            }
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className="mt-4"
          />
        )}
      </Modal>

      {/* Sign Modal */}
      <Modal
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        title="Nip-07 browser extension needed to sign"
      >
        {!isSigning && (
          <div>
            <CheckCircleTwoTone /> Access granted
          </div>
        )}
        {isSigning && (
          <div>
            <Spin size="small" /> Waiting for you to finish signing your
            response. Click{" "}
            <a
              href="https://nostrcheck.me/register/browser-extension.php"
              target="_blank"
              rel="noreferrer"
            >
              here
            </a>{" "}
            to read more about nip-07 signing.
          </div>
        )}
      </Modal>
    </>
  );
};
