import { SimplePool, UnsignedEvent, nip19 } from "nostr-tools";
import { FormSpec, V1FormSpec } from "../../interfaces";
import {
  generateIds,
  getDefaultRelays,
  getUserPublicKey,
  saveFormOnNostr,
  signEvent,
} from "../formstr";
import { getSchema, isValidSpec } from "../../utils/validators";
import { bytesToHex } from "@noble/hashes/utils";
import { AnswerTypes } from "../../interfaces";
import { makeTag } from "../../utils/utils";

const defaultRelays = getDefaultRelays();

export type Field = [
  placeholder: string,
  fieldId: string,
  dataType: string,
  label: string,
  options: string,
  config: string,
];

export const createForm = async (
  form: Array<Field>,
  userSecretKey: Uint8Array | null,
  relayList: Array<string> = defaultRelays
) => {
  const pool = new SimplePool();
  let userPubkey = await getUserPublicKey(userSecretKey);
  const baseTemplateEvent: UnsignedEvent = {
    kind: 30168,
    created_at: Math.floor(Date.now() / 1000),
    tags: form,
    content: "",
    pubkey: userPubkey,
  };
  console.log("event is ", baseTemplateEvent);
  const templateEvent = await signEvent(baseTemplateEvent, userSecretKey);
  console.log("final event is ", templateEvent);
  await Promise.allSettled(pool.publish(relayList, templateEvent));
  pool.close(relayList);
};
