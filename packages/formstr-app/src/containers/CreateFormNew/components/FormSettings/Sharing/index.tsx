import { Tooltip, Typography } from "antd";
import { isMobile } from "../../../../../utils/utility";
import useFormBuilderContext from "../../../hooks/useFormBuilderContext";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import AddNpubStyle from "../addNpub.style";
import { Editors } from "./Editors";
import { Participants } from "./Participants";

enum ROLE {
  VIEW,
  EDIT,
}

const { Text } = Typography;
export const Sharing = () => {
  const { editList, viewList, setEditList, setViewList } =
    useFormBuilderContext();
  const [isEditListOpen, setIsEditListOpen] = useState<boolean>(false);
  const [isViewListOpen, setIsViewListOpen] = useState<boolean>(false);
  return (
    <>
      <Tooltip
        title="Notify the given nostr profiles when a response is submitted"
        trigger={isMobile() ? "click" : "hover"}
      >
        <div className="property-setting">
          <Text>Configure Editors</Text>
          <EditOutlined
            onClick={() => {
              setIsEditListOpen(true);
            }}
          />
          <Text>Configure Participants</Text>
          <EditOutlined onClick={() => setIsViewListOpen(true)} />
          <Editors
            open={isEditListOpen}
            onCancel={() => setIsEditListOpen(false)}
          />
          <Participants
            open={isViewListOpen}
            onCancel={() => setIsViewListOpen(false)}
          />
        </div>
      </Tooltip>
    </>
  );
};
