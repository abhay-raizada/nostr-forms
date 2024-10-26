import { Button, Divider, Input, Modal, Typography } from "antd";
import AddNpubStyle from "../addNpub.style";
import { ReactNode, useState } from "react";
import { isValidNpub } from "./utils";
import useFormBuilderContext from "../../../hooks/useFormBuilderContext";
import { useProfileContext } from "../../../../../hooks/useProfileContext";
import { nip19 } from "nostr-tools";
import { NpubList } from "./NpubList";

interface EditorProps {
  open: boolean;
  onCancel: () => void;
}

const { Text } = Typography;

export const Editors: React.FC<EditorProps> = ({ open, onCancel }) => {
  const { pubkey: userPubkey, requestPubkey } = useProfileContext();
  const { editList, setEditList } = useFormBuilderContext();
  return (
    <Modal open={open} onCancel={onCancel} footer={null}>
      <NpubList
        NpubList={editList}
        setNpubList={setEditList}
        ListHeader={"Add Admins"}
      />
    </Modal>
  );
};
