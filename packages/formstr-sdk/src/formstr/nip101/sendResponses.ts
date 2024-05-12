import {
  SimplePool,
  UnsignedEvent,
  generateSecretKey,
  getPublicKey,
} from "nostr-tools";
import { V1Submission } from "../../interfaces";
import {
  encryptMessage,
  getDefaultRelays,
  getUserPublicKey,
  signEvent,
} from "../formstr";
import { fetchFormTemplate } from "./fetchFormTemplate";
import { Response } from "./interfaces";

const defaultRelays = getDefaultRelays();

export const sendResponses = async (
  formAuthorPub: string,
  formId: string,
  responses: Response[],
  responderSecretKey: Uint8Array | null = null
) => {
  let responderPub;
  responderPub = await getUserPublicKey(responderSecretKey);
  const baseEvent: UnsignedEvent = {
    kind: 30169,
    pubkey: responderPub,
    tags: [["a", `30168:${formAuthorPub}:${formId}`], ...responses],
    content: "",
    created_at: Math.floor(Date.now() / 1000),
  };
  const fullEvent = await signEvent(baseEvent, responderSecretKey);
  const pool = new SimplePool();
  await Promise.allSettled(pool.publish(defaultRelays, fullEvent));
  pool.close(defaultRelays);
};
