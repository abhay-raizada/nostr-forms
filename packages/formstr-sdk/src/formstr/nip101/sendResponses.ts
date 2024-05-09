import {
  SimplePool,
  UnsignedEvent,
  generateSecretKey,
  getPublicKey,
  nip19,
} from "nostr-tools";
import { V1Submission } from "../../interfaces";
import {
  encryptMessage,
  getDefaultRelays,
  getUserPublicKey,
  signEvent,
} from "../formstr";
import { fetchFormTemplate } from "./fetchFormTemplate";

const defaultRelays = getDefaultRelays();

export const sendResponses = async (
  formAuthorPub: string,
  formId: string,
  responses: Array<V1Submission>,
  anonymous: boolean,
  userSecretKey: Uint8Array | null = null
) => {
  let formAuthor = formAuthorPub;
  let relayList = defaultRelays;
  if (formId.startsWith("nprofile")) {
    const { pubkey, relays } = nip19.decode(formId)
      .data as nip19.ProfilePointer;
    formAuthor = pubkey;
    relayList = relays || defaultRelays;
  }
  const form = await fetchFormTemplate(formAuthor, formId);
  const questionIds = form.fields?.map((field) => field.questionId) || [];
  console.log("Responses are", responses, questionIds);
  responses.forEach((response) => {
    if (!questionIds.includes(response.questionId)) {
      throw Error(
        `No such question ID: ${response.questionId} found in the template`
      );
    }
  });

  const message = JSON.stringify(responses);
  let userPk;
  let userSk = null;
  let ciphertext;
  if (anonymous) {
    userSk = generateSecretKey();
    userPk = getPublicKey(userSk);
  } else if (!anonymous && userSecretKey) {
    userSk = userSecretKey;
    userPk = getPublicKey(userSk);
  } else {
    userPk = await getUserPublicKey(userSecretKey);
  }

  ciphertext = await encryptMessage(message, formAuthor, userSk, "nip44");
  const baseKind4Event: UnsignedEvent = {
    kind: 30169,
    pubkey: userPk,
    tags: [["a", `30168:${formAuthor}:${formId}`]],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
  };
  const kind4Event = await signEvent(baseKind4Event, userSk);
  const pool = new SimplePool();
  await Promise.allSettled(pool.publish(relayList, kind4Event));
  pool.close(relayList);
  return userPk!;
};
