import { fetchFormTemplate } from "@formstr/sdk/dist/formstr/nip101/fetchFormTemplate";
import { useEffect, useState } from "react";
import { Event, nip44 } from "nostr-tools";
import { Typography } from "antd";
import {
  Actions,
  NIP07Interactions,
} from "../../../components/NIP07Interactions";
import { Tag } from "@formstr/sdk/dist/formstr/nip101";

const { Text } = Typography;

interface PrepareFormProps {
  pubKey: string;
  formId: string;
  formSpecCallback: (fields: Tag[], formEvent: Event) => void;
}

export const PrepareForm: React.FC<PrepareFormProps> = ({
  pubKey,
  formId,
  formSpecCallback,
}) => {
  const [formEvent, setFormEvent] = useState<Event | undefined>(undefined);
  const [decryptKey, setDecryptKey] = useState<string | undefined>(undefined);
  const [formNotFound, setFormNotFound] = useState<boolean>(false);
  const [userPubKey, setUserPubkey] = useState<string | undefined>(undefined);

  const fetchFormEvent = async () => {
    if (!pubKey || !formId) {
      setFormNotFound(true);
      return;
    }
    if (!formEvent) {
      const event = await fetchFormTemplate(pubKey, formId);
      if (!event) {
        setFormNotFound(true);
        return;
      } else {
        setFormEvent(event);
        checkUserAccess(event);
      }
    } else {
      checkUserAccess(formEvent);
    }
  };

  const checkUserAccess = (formEvent: Event) => {
    if (!formEvent) return;
    if (formEvent.content === "") {
      formSpecCallback(formEvent.tags, formEvent);
      return;
    }
    let key = formEvent.tags.find((tag) => {
      return tag[0] === "key" && tag[1] === userPubKey;
    });
    if (!key) {
      return;
    }
    if (key[2]) setDecryptKey(key[2]);
  };

  const hasAccess = () => {
    if (!formEvent || !userPubKey) return null;
    if (
      formEvent.tags
        .filter((tag) => tag[0] == "key")
        .map((tag) => tag[1])
        .includes(userPubKey)
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    console.log(
      "following are the variables,",
      formEvent,
      pubKey,
      userPubKey,
      decryptKey
    );
    fetchFormEvent();
  }, [formEvent, userPubKey, decryptKey]);

  if (formEvent === undefined) return <Text>Fetching Form ...</Text>;
  else if (formNotFound)
    return <Text>Could not find the form you are looking for</Text>;
  else if (hasAccess() === false)
    return <Text> The npub you used does not have access to this form.</Text>;
  if (formEvent !== undefined && userPubKey === undefined) {
    return (
      <NIP07Interactions
        action={Actions.GET_PUBKEY}
        ModalMessage="Please approve the request to fetch your pubkey from the nip-07 browser extension"
        callback={(pubKey: string | Event) => {
          setUserPubkey(pubKey as string);
        }}
      />
    );
  } else if (decryptKey && formEvent.content !== "") {
    return (
      <NIP07Interactions
        action={Actions.NIP44_DECRYPT}
        ModalMessage="Please approve the request to decrypt the form content"
        cipherText={decryptKey}
        senderPubKey={pubKey}
        callback={(viewKey: string | Event) => {
          let conversationKey = nip44.v2.utils.getConversationKey(
            viewKey as string,
            pubKey
          );
          const formSpec = nip44.v2.decrypt(
            formEvent.content,
            conversationKey
          ) as string;
          formSpecCallback(JSON.parse(formSpec) as Tag[], formEvent);
        }}
      />
    );
  }
};
