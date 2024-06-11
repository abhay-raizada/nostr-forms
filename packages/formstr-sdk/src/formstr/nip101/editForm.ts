import {
  Event,
  SimplePool,
  UnsignedEvent,
  finalizeEvent,
  generateSecretKey,
  getEventHash,
  getPublicKey,
} from "nostr-tools";
import { AccesType, AccessRequest, Tag } from "./interfaces";
import { nip44Encrypt } from "./utils";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { getDefaultRelays } from "../formstr";
import { wrap } from "module";

interface IWrap {
  wrapEvent: Event;
  pubkey: string;
}

const now = () => Math.round(Date.now() / 1000);

type Rumor = UnsignedEvent & { id: string };

const createRumor = (event: Partial<UnsignedEvent>, privateKey: Uint8Array) => {
  const rumor = {
    created_at: now(),
    content: "",
    tags: [],
    ...event,
    pubkey: getPublicKey(privateKey),
  } as any;

  rumor.id = getEventHash(rumor);

  return rumor as Rumor;
};

const createSeal = (
  rumor: Rumor,
  privateKey: Uint8Array,
  recipientPublicKey: string
) => {
  return finalizeEvent(
    {
      kind: 13,
      content: nip44Encrypt(
        privateKey,
        recipientPublicKey,
        JSON.stringify(rumor)
      ),
      created_at: now(),
      tags: [],
    },
    privateKey
  ) as Event;
};

const createWrap = (event: Event, recipientPublicKey: string) => {
  const randomKey = generateSecretKey();

  return finalizeEvent(
    {
      kind: 1059,
      content: nip44Encrypt(
        randomKey,
        recipientPublicKey,
        JSON.stringify(event)
      ),
      created_at: now(),
      tags: [["p", recipientPublicKey]],
    },
    randomKey
  ) as Event;
};

const hasKeyTagAccess = (keyTag: Tag, accessType: AccesType) => {
  let ACCESS_TYPE_KEY_INDEX_MAP = {
    vote: 4,
    edit: 3,
    view: 2,
  };
  return !!keyTag[ACCESS_TYPE_KEY_INDEX_MAP[accessType]];
};

const sendWraps = (wraps: IWrap) => {};

const createTag = (
  signingKey: string,
  pubKey: string,
  accessType: AccesType,
  voterKey: Uint8Array
) => {
  let encryptedEditKey;
  let encryptedViewKey;
  let encryptedVoteKey;
  if (accessType === "vote") {
    encryptedVoteKey = nip44Encrypt(voterKey, pubKey, bytesToHex(voterKey));
  }
  if (accessType === "edit") {
    encryptedEditKey = nip44Encrypt(hexToBytes(signingKey), pubKey, signingKey);
  }
  return [
    "key",
    pubKey,
    encryptedViewKey || "",
    encryptedEditKey || "",
    encryptedVoteKey || "",
  ];
};

const modifyKeyTag = (tag: Tag, accessType: AccesType, signingKey: string) => {
  let voterId = "";
  let newTag = tag;
  if (accessType === "vote") {
    let votersecret = generateSecretKey();
    voterId = getPublicKey(votersecret);
    let encryptedVoterSecret = nip44Encrypt(
      votersecret,
      tag[1],
      bytesToHex(votersecret)
    );
    newTag[4] = encryptedVoterSecret;
  }
  return { tag: newTag, voterId };
};

const grantAccess = (
  formEvent: Event | UnsignedEvent,
  pubkey: string,
  accessType: AccesType,
  signingKey: string
) => {
  const voterKey = generateSecretKey();
  const voterId = getPublicKey(voterKey);
  const issuerPubkey = getPublicKey(hexToBytes(signingKey));
  let newTags = formEvent.tags;
  newTags.push(["v", voterId]);

  const rumor = createRumor(
    {
      kind: 18,
      pubkey: issuerPubkey,
      tags: [createTag(signingKey, pubkey, accessType, voterKey)],
    },
    hexToBytes(signingKey)
  );
  const seal = createSeal(rumor, hexToBytes(signingKey), pubkey);
  const wrap = createWrap(seal, pubkey);

  return { formEvent, wrap: { wrapEvent: wrap, pubkey } };
};

export const acceptAccessRequests = async (
  requests: AccessRequest[],
  signingKey: string,
  formEvent: Event
) => {
  let newFormEvent: Event | UnsignedEvent = formEvent;
  let wraps: any = [];
  requests.forEach((request) => {
    let { formEvent: newForm, wrap } = grantAccess(
      newFormEvent,
      request.pubkey,
      request.accessType,
      signingKey
    );
    newFormEvent = newForm;
    wraps.push(wrap);
  });
  sendWraps(wraps);
  newFormEvent.created_at = Math.floor(Date.now() / 1000);
  let finalEvent = finalizeEvent(newFormEvent, hexToBytes(signingKey));
  console.log("FINAL EDITED EVENT IS", finalEvent);
  const pool = new SimplePool();
  let a = await Promise.allSettled(
    pool.publish(getDefaultRelays(), finalEvent)
  );
  console.log("Published!!!", a);
};

export const editForm = () => {};
