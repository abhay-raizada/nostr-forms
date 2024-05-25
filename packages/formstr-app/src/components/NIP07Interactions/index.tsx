import { Modal } from "antd";
import { Event } from "nostr-tools";
import { useEffect, useState } from "react";

export enum Actions {
  GET_PUBKEY,
  SIGN_EVENT,
  NIP04_ENCRYPT,
  NIP04_DECRYPT,
  NIP44_ENCRYPT,
  NIP44_DECRYPT,
  GET_RELAYS,
}

interface NIP07InteractionProps {
  action: Actions;
  ModalMessage: string;
  callback: (returnValue: string) => void;
  senderPubKey?: string;
  plainText?: string;
  event?: Event;
  cipherText?: string;
  receiverPubkey?: string;
}

export const NIP07Interactions: React.FC<NIP07InteractionProps> = ({
  action,
  ModalMessage,
  callback,
  event,
  plainText,
  cipherText,
  senderPubKey,
}) => {
  const executeAction = async () => {
    console.log("Got Action as...", action);
    setShowModal(true);
    let returnValue = "";
    if (action === Actions.GET_PUBKEY) {
      returnValue = await window.nostr.getPublicKey();
    } else if (action === Actions.SIGN_EVENT) {
      return await window.nostr.signEvent(event);
    } else if (action === Actions.NIP44_ENCRYPT) {
      let pubKey = await window.nostr.getPublicKey();
      if (!plainText) {
        throw Error("No message provided to encrypt");
      }
      returnValue = await window.nostr.nip44.encrypt(pubKey, plainText);
    } else if (action === Actions.NIP44_DECRYPT) {
      if (!cipherText) {
        throw Error("No message provided to decrypt");
      }
      if (!senderPubKey) {
        throw Error("No message provided to decrypt");
      }
      console.log("Sender pubkey,", senderPubKey);
      returnValue = await window.nostr.nip44.decrypt(senderPubKey, cipherText);
    } else if (action === Actions.NIP04_DECRYPT) {
      if (!cipherText) {
        throw Error("No message provided to decrypt");
      }
      if (!senderPubKey) {
        throw Error("No message provided to decrypt");
      }
      returnValue = await window.nostr.nip04.decrypt(senderPubKey, cipherText);
    } else if (action === Actions.NIP04_ENCRYPT) {
      let pubKey = await window.nostr.getPublicKey();
      if (!plainText) {
        throw Error("No message provided to decrypt");
      }
      returnValue = await window.nostr.nip04.encrypt(pubKey, plainText);
    } else {
      throw Error("NOT A RECOGNIZED ACTION");
    }
    setShowModal(false);
    callback(returnValue);
    return;
  };
  useEffect(() => {
    executeAction();
  }, []);
  const [showModal, setShowModal] = useState<boolean>(false);

  return (
    <Modal open={showModal} footer={null}>
      {ModalMessage}
    </Modal>
  );
};