import { Button, Divider, Input, Modal, Typography } from "antd";
import AddNpubStyle from "../addNpub.style";
import { ReactNode, useState } from "react";
import { isValidNpub } from "./utils";
import useFormBuilderContext from "../../../hooks/useFormBuilderContext";
import { useProfileContext } from "../../../../../hooks/useProfileContext";
import { nip19 } from "nostr-tools";

interface ParticipantProps {
  open: boolean;
  onCancel: () => void;
}
const { Text } = Typography;

export const Participants: React.FC<ParticipantProps> = ({
  open,
  onCancel,
}) => {
  const { viewList, setViewList } = useFormBuilderContext();
  const [newNpub, setNewNpub] = useState<string>();

  const renderList = () => {
    const elements: ReactNode[] = [];
    (viewList || new Set()).forEach(
      (value: string, key: string, set: Set<string>) => {
        elements.push(
          <li>
            <Typography.Text>{nip19.npubEncode(value).substring(0, 10) + "..."}</Typography.Text>
          </li>
        );
      }
    );
    console.log(viewList)
    return <ul>{elements}</ul>;
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null}>
      <AddNpubStyle className="modal-container">
        {(viewList || {}).size === 0 && (
          <Typography.Text>
            The form is currently public for everyone
          </Typography.Text>
        )}
        {(viewList || {}).size !== 0 && (
          <Typography.Text>
            Only the npubs below can fill the form
          </Typography.Text>
        )}
        {renderList()}
        <Divider />
        <Typography.Text>Add participants for the form</Typography.Text>
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
            setViewList(new Set(viewList).add(nip19.decode(newNpub!).data as string));
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
