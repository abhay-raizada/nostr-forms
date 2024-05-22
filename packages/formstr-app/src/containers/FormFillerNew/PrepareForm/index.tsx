import { fetchFormTemplate } from "@formstr/sdk/dist/formstr/nip101/fetchFormTemplate";
import { useEffect, useState } from "react";
import { Event, nip44 } from "nostr-tools";
import { hexToBytes } from "@noble/hashes/utils";
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
  formSpecCallback: (fields: Tag[]) => void;
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
    const event = await fetchFormTemplate(pubKey, formId);
    if (!event) {
      setFormNotFound(true);
      return;
    }
    setFormEvent(event);
  };

  const checkPublicAccess = () => {
    if (!formEvent) return;
    else if (formEvent.content === "") {
      formSpecCallback(formEvent.tags);
    }
  };

  const checkUserAccess = async () => {
    if (!userPubKey || !formEvent) return;
    console.log("Tags are", formEvent.tags, "user Pubkey is", userPubKey);
    let key = formEvent.tags.find((tag) => {
      return tag[0] === "key" && tag[1] === userPubKey;
    });
    if (!key) {
      return;
    }
    console.log("found key as ", key, key[2]);
    setDecryptKey(key[2]);
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
    if (formEvent === undefined) {
      fetchFormEvent();
    }
    if (formEvent) {
      checkPublicAccess();
    }
    if (decryptKey === undefined) {
      checkUserAccess();
    }
  }, [formEvent]);
  console.log("Decrypt key is", decryptKey);

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
        callback={(pubKey: string) => {
          setUserPubkey(pubKey);
        }}
      />
    );
  } else if (decryptKey !== undefined) {
    console.log("DECRYPT KeY WEGOT ITTTTT", decryptKey);
    return (
      <NIP07Interactions
        action={Actions.NIP44_DECRYPT}
        ModalMessage="Please approve the request to decrypt the form content"
        cipherText={decryptKey}
        senderPubKey={pubKey}
        callback={(viewKey: string) => {
          console.log("got decrypt key as ", viewKey);
          let conversationKey = nip44.v2.utils.getConversationKey(
            viewKey,
            pubKey
          );
          const formSpec = nip44.v2.decrypt(
            formEvent.content,
            conversationKey
          ) as string;
          formSpecCallback(JSON.parse(formSpec) as Tag[]);
        }}
      />
    );
  }
};
