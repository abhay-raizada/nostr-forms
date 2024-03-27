import {
  SimplePool,
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  nip19,
} from "nostr-tools";
import { V1Submission } from "../../interfaces";
import { getFormTemplate, encryptMessage } from "../formstr";

const defaultRelays = [
  "wss://relay.damus.io/",
  "wss://relay.primal.net/",
  "wss://nos.lol",
  "wss://relay.nostr.wirednet.jp/",
  "wss://nostr-01.yakihonne.com",
  "wss://relay.leligobit.link",
  "wss://relay.snort.social",
  "wss://relay.swisslightning.net",
  "wss://relay.hllo.live",
  "wss://relay.nostr.band",
  "wss://nostr21.com",
  "wss://relay.mutinywallet.com",
];

export const sendNip101Response = async (
  formId: string,
  responses: Array<V1Submission>,
  anonymous: boolean,
  userSecretKey: Uint8Array | null = null
) => {
  let formIdPubkey = formId;
  let relayList = defaultRelays;
  if (formId.startsWith("nprofile")) {
    const { pubkey, relays } = nip19.decode(formId)
      .data as nip19.ProfilePointer;
    formIdPubkey = pubkey;
    relayList = relays || defaultRelays;
  }
  const form = await getFormTemplate(formId);
  const questionIds = form.fields?.map((field) => field.questionId) || [];
  responses.forEach((response) => {
    if (!questionIds.includes(response.questionId)) {
      throw Error(
        `No such question ID: ${response.questionId} found in the template`
      );
    }
  });

  const message = JSON.stringify(responses);
  let userPk = "";
  let userSk = null;
  let ciphertext;
  if (anonymous) {
    userSk = generateSecretKey();
    userPk = getPublicKey(userSk);
  }
  if (!anonymous && userSecretKey) {
    userSk = userSecretKey;
    userPk = getPublicKey(userSk);
  }

  if (!anonymous && !userSecretKey) {
    userPk = getPublicKey(userSecretKey!);
  }

  ciphertext = await encryptMessage(message, formIdPubkey, userSk, "nip44");
  const baseKind4Event = {
    kind: 30168,
    pubkey: userPk,
    tags: [["p", formIdPubkey]],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
  };
  const kind4Event = finalizeEvent(baseKind4Event, userSk!);
  const pool = new SimplePool();
  pool.publish(relayList, kind4Event);
  pool.close(relayList);
  return userPk;
};

