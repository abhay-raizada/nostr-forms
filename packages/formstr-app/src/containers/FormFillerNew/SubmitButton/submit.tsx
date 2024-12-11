import { LoadingOutlined, DownOutlined } from "@ant-design/icons";
import { Button, FormInstance, Dropdown, MenuProps } from "antd";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const submitForm = async (anonymous: boolean = true) => {
    setIsDisabled(true);
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

  const handleMenuClick: MenuProps["onClick"] = async (e) => {
    if (e.key === "signSubmition") {
      await submitForm(false);
    } else {
      await submitForm(true);
    }
  };

  const handleButtonClick = async () => {
    await submitForm(!selfSign);
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
    <Dropdown.Button
      menu={menuProps}
      type="primary"
      onClick={handleButtonClick}
      icon={<DownOutlined />}
      disabled={isDisabled}
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
  );
};