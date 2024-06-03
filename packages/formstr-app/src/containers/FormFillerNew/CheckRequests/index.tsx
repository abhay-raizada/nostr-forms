import { CheckOutlined, EditOutlined } from "@ant-design/icons";
import { getDefaultRelays } from "@formstr/sdk";
import { Tag } from "@formstr/sdk/dist/formstr/nip101";
import { Button, Divider, Modal, Typography } from "antd";
import { SimplePool, Event, nip19 } from "nostr-tools";
import { FC, useEffect, useState } from "react";
import { acceptAccessRequests } from "@formstr/sdk/dist/formstr/nip101/editForm";

const { Text } = Typography;
interface CheckRequests {
  pubkey: string;
  formId: string;
  secretKey: string;
  formEvent: Event;
}

export const CheckRequests: FC<CheckRequests> = ({
  pubkey,
  formId,
  secretKey,
  formEvent,
}) => {
  const [showRequests, setShowRequests] = useState<boolean>(false);
  const [unacceptedPubkeys, setUnaccptedPubkeys] = useState<
    string[] | undefined
  >();
  const [acceptedRequests, setAcceptedRequests] = useState<
    string[] | undefined
  >();

  const addPubkeyToAcceptList = (pubkey: string) => {
    let newUnacceptedPubs = (unacceptedPubkeys || []).filter(
      (p) => p !== pubkey
    );
    setUnaccptedPubkeys(newUnacceptedPubs);
    let newAccepted = [...(acceptedRequests || []), pubkey];
    setAcceptedRequests(newAccepted);
  };
  useEffect(() => {
    const getRequests = async () => {
      let filter = {
        kinds: [202],
        "#a": [`30168:${pubkey}:${formId}`],
      };
      let pool = new SimplePool();
      let requests = await pool.querySync(getDefaultRelays(), filter);
      console.log("Got merge requests", requests);
      let requestPubkeys = requests.map((request: Event) => request.pubkey);
      let acceptedPubkeys = formEvent.tags
        .filter((tag: Tag) => tag[0] === "key" && !!tag[4])
        .map((tag) => tag[1]);
      let unacceptedPubkeys = requestPubkeys.filter(
        (pub) => !acceptedPubkeys.includes(pub)
      );
      setUnaccptedPubkeys(unacceptedPubkeys);
    };
    getRequests();
  }, []);
  return (
    <>
      <Button
        onClick={() => setShowRequests(true)}
        icon={<EditOutlined />}
        type="primary"
      />
      <Modal
        open={showRequests}
        onCancel={() => {
          setShowRequests(false);
        }}
        onOk={() => setShowRequests(false)}
        footer={null}
      >
        <Text>Unaccepted Participation Requests:</Text>
        <br />
        {(unacceptedPubkeys || []).map((pubkey) => {
          return (
            <>
              <Text>{nip19.npubEncode(pubkey)}</Text>
              <Button
                onClick={() => {
                  addPubkeyToAcceptList(pubkey);
                }}
                size="small"
                icon={<CheckOutlined />}
              />
            </>
          );
        })}
        <Divider />
        <Text>Giving access to the following npubs</Text>
        <br />
        {acceptedRequests}
        <Button
          onClick={() => {
            acceptAccessRequests(
              (acceptedRequests || []).map((pubkey: string) => {
                return {
                  pubkey,
                  accessType: "vote",
                };
              }),
              secretKey,
              formEvent
            );
            setShowRequests(false);
          }}
          type={"primary"}
        >
          Accept Requests
        </Button>
      </Modal>
    </>
  );
};
