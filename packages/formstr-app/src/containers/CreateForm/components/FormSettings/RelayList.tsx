import { Button, Collapse, Input, Typography } from "antd";
import { getDefaultRelays } from "@formstr/sdk";
import { makeTag } from "@formstr/sdk/dist/utils/utils";
import { DeleteOutlined, EditOutlined, SaveFilled } from "@ant-design/icons";
import { ChangeEvent, useState } from "react";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";

const { Text } = Typography;

function isValidWebSocketUrl(url: string): boolean {
  const websocketUrlPattern =
    /^(wss?:\/\/)([^:@/]+(?::[^@/]+)?@)?([^:/]+)(?::(\d+))?(\/.*)?$/;

  const match = url.match(websocketUrlPattern);

  if (!match) {
    return false;
  }

  const [, scheme, , , port] = match;

  if (!scheme || (scheme !== "ws://" && scheme !== "wss://")) {
    return false;
  }
  if (port !== undefined) {
    const portNumber = parseInt(port, 10);
    if (!(0 <= portNumber && portNumber <= 65535)) {
      return false;
    }
  }

  return true;
}

const RelayListItem = ({
  relay,
  onEdit,
  onDelete,
}: {
  relay: { url: string; tempId: string };
  onEdit: (newRelayUrl: string, tempId: string) => void;
  onDelete: (tempId: string) => void;
}) => {
  const [edit, setEdit] = useState(false);
  const [editInput, setEditInput] = useState(relay.url);
  const [isError, setIsError] = useState(false);

  const onEditRelay = () => {
    if (!isValidWebSocketUrl(editInput)) {
      setIsError(true);
      return;
    }
    setEdit(false);
    onEdit(editInput, relay.tempId);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditInput(e.target.value);
  };

  const handleDelete = (e: any) => {
    onDelete(relay.tempId);
  };
  return (
    <>
      <div className="relay-item">
        {!edit && (
          <>
            <div className="relay-text-container">
              <label> {relay.url} </label>
            </div>
            <div>
              <EditOutlined
                onClick={() => {
                  setEdit(true);
                }}
                className="relay-icons"
              />
              <DeleteOutlined className="relay-icons" onClick={handleDelete} />
            </div>
          </>
        )}
        {edit && (
          <>
            <Input defaultValue={relay.url} onChange={handleInputChange} />
            <Button
              size="middle"
              icon={<SaveFilled />}
              type="primary"
              onClick={onEditRelay}
            />
          </>
        )}
      </div>
      {isError && <Text type="danger"> Not a valid websocket url</Text>}
    </>
  );
};

const RelayListItems = () => {
  let relays = getDefaultRelays().map((relay) => {
    return { url: relay, tempId: makeTag(6) };
  });
  const { relayList, setRelayList } = useFormBuilderContext();

  const onEdit = (newRelay: string, tempId: string) => {
    relays = relayList.map((relay) => {
      if (relay.tempId === tempId) {
        return { url: newRelay, tempId: tempId };
      }
      return relay;
    });
    setRelayList(relays);
  };

  const onDelete = (tempId: string) => {
    relays = relayList.filter((relay) => relay.tempId !== tempId);
    setRelayList(relays);
  };

  return (
    <>
      {relayList.map((relay) => (
        <RelayListItem
          relay={relay}
          onEdit={onEdit}
          onDelete={onDelete}
          key={relay.tempId}
        />
      ))}
    </>
  );
};

export const RelayList = () => {
  return (
    <Collapse
      items={[
        {
          key: "Relays",
          label: "Relays",
          children: RelayListItems(),
        },
      ]}
      expandIconPosition="end"
      ghost
    />
  );
};
