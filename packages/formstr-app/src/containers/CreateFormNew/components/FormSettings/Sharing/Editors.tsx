import { Button, Divider, Input, Modal, Typography } from "antd";
import AddNpubStyle from "../addNpub.style";
import { ReactNode, useState } from "react";
import { isValidNpub } from "./utils";
import useFormBuilderContext from "../../../hooks/useFormBuilderContext";
import { useProfileContext } from "../../../../../hooks/useProfileContext";
import { nip19 } from "nostr-tools";

interface EditorProps {
  open: boolean;
  onCancel: () => void;
}

const { Text } = Typography;

export const Editors: React.FC<EditorProps> = ({ open, onCancel }) => {
  const { pubkey: userPubkey, requestPubkey} = useProfileContext();
  const { editList, setEditList } = useFormBuilderContext();
  const [newNpub, setNewNpub] = useState<string>();

  const renderList = () => {
    const elements: ReactNode[] = [];
    (editList || new Set()).forEach(
      (value: string, key: string, set: Set<string>) => {
        elements.push(
          <li>
            <Typography.Text>{nip19.npubEncode(value).substring(0, 10) + "..."}</Typography.Text>
          </li>
        );
      }
    );
    return <ul>{elements}</ul>;
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null}>
      <AddNpubStyle className="modal-container">
        <Text>Add editors for the form</Text>'
        {userPubkey ? null : <><Text>Login to add your own pubkey as an editor!</Text><Button onClick={() => {requestPubkey()}}>Login</Button></> }
        <Divider />
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
            setEditList(new Set(editList).add(nip19.decode(newNpub!).data as string));
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
