import React from "react";
import { Input, InputRef, Modal, Typography } from "antd";
import { FormPassword } from "@formstr/sdk/dist/interfaces";

export const PasswordInput: React.FC<{
  onPasswordEnter: (password: string) => void;
  previousPassword: FormPassword;
}> = ({ onPasswordEnter, previousPassword }) => {
  const inputRef = React.useRef<InputRef | null>(null);
  return (
    <Modal
      open
      cancelButtonProps={{ disabled: true }}
      closeIcon={false}
      title={"Enter Password"}
      onOk={() => {
        if (inputRef.current?.input?.value) {
          onPasswordEnter(inputRef.current.input.value);
        }
      }}
    >
      <Typography>
        This form requires a password to be filled. Please enter the password
        and press and click Ok.
      </Typography>
      <Typography>
        If you dont have the password, please contact the form owner
      </Typography>
      <Input defaultValue={previousPassword || ""} ref={inputRef} />
    </Modal>
  );
};
