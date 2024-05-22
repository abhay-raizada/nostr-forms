import {
  SimplePool,
  UnsignedEvent,
  generateSecretKey,
  getPublicKey,
  nip19,
  nip44,
} from "nostr-tools";
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
import { Field, Tag } from "./interfaces";

const defaultRelays = getDefaultRelays();

export const createForm = async (
  form: Array<Tag>,
  signingKey: Uint8Array,
  relayList: Array<string> = defaultRelays,
  viewList: Set<string>,
  EditList: Set<string>
) => {
  const pool = new SimplePool();
  let userPubkey = await getUserPublicKey(signingKey);

  let tags = [];
  let viewKey = generateSecretKey();
  let content = "";
  if (viewList.size !== 0) {
    let formNameTag = form.find((tag) => tag[0] === "name");
    if (formNameTag) tags.push(formNameTag);
    let formIdTag = form.find((tag) => tag[0] === "d");
    if (formIdTag) tags.push(formIdTag);
    viewList.forEach((npub: string) => {
      let npubHex = nip19.decode(npub).data as string;
      let conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(signingKey),
        npubHex
      );
      let encyptedViewKey = nip44.v2.encrypt(
        bytesToHex(viewKey),
        conversationKey
      );
      tags.push(["p", `${npubHex}`]);
      tags.push(["key", `${npubHex}`, `${encyptedViewKey}`, ""]);
    });
    let encryptionKey = nip44.v2.utils.getConversationKey(
      bytesToHex(signingKey),
      getPublicKey(viewKey)
    );
    content = nip44.v2.encrypt(JSON.stringify(form), encryptionKey);
  }
  if (EditList.size !== 0) {
    EditList.forEach((npub: string) => {
      let npubHex = nip19.decode(npub).data as string;
      let conversationKey = nip44.v2.utils.getConversationKey(
        bytesToHex(signingKey),
        npubHex
      );
      let encyptedKey = nip44.v2.encrypt(bytesToHex(viewKey), conversationKey);
      tags.push(["p", `${npubHex}`]);
      tags.push(["key", `${npubHex}`, "", `${encyptedKey}`]);
    });
  }
  if (viewList.size === 0) {
    tags = [...tags, ...form];
  }

  const baseTemplateEvent: UnsignedEvent = {
    kind: 30168,
    created_at: Math.floor(Date.now() / 1000),
    tags: tags,
    content: content,
    pubkey: userPubkey,
  };

  const templateEvent = await signEvent(baseTemplateEvent, signingKey);
  console.log("final event is ", templateEvent);
  await Promise.allSettled(pool.publish(relayList, templateEvent));
  pool.close(relayList);
};
