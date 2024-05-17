import { Button, Input, Modal, Typography } from "antd";
import AddNpubStyle from "../addNpub.style";
import { ReactNode, useState } from "react";
import { isValidNpub } from "./utils";
import useFormBuilderContext from "../../../hooks/useFormBuilderContext";

interface EditorProps {
  open: boolean;
  onCancel: () => void;
}

export const Editors: React.FC<EditorProps> = ({ open, onCancel }) => {
  const { editList, setEditList } = useFormBuilderContext();
  const [newNpub, setNewNpub] = useState<string>();

  const renderList = () => {
    const elements: ReactNode[] = [];
    (editList || new Set()).forEach(
      (value: string, key: string, set: Set<string>) => {
        elements.push(
          <li>
            <Typography.Text>{value.substring(0, 10) + "..."}</Typography.Text>
          </li>
        );
      }
    );
    return <ul>{elements}</ul>;
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null}>
      <AddNpubStyle className="modal-container">
        <Typography.Text>Add editors for the form</Typography.Text>
        {renderList()}
        <Input
          placeholder="Enter nostr npub"
          value={newNpub}
          onChange={(e) => setNewNpub(e.target.value)}
          className="npub-input"
        />
        {newNpub && !isValidNpub(newNpub) && (
          <div>
            <Typography.Text className="error-npub">
              this is not a valid npub
            </Typography.Text>
          </div>
        )}
        <Button
          type="primary"
          className="add-button"
          disabled={!isValidNpub(newNpub || "")}
          onClick={() => {
            setEditList(new Set(editList).add(newNpub!));
            setNewNpub("");
          }}
        >
          {" "}
          Add{" "}
        </Button>
      </AddNpubStyle>
    </Modal>
  );
};
