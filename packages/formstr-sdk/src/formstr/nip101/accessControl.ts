import {
  Event,
  Filter,
  SimplePool,
  UnsignedEvent,
  finalizeEvent,
  generateSecretKey,
  getEventHash,
  getPublicKey,
} from "nostr-tools";
import { AccessRequest, IWrap } from "./interfaces";
import { nip44Encrypt } from "./utils";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { getDefaultRelays } from "../formstr";
import { sha256 } from "@noble/hashes/sha256"

const now = () => Math.round(Date.now() / 1000);

type Rumor = UnsignedEvent & { id: string };

const defaultRelays = getDefaultRelays();

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

const createWrap = (event: Event, recipientPublicKey: string, eventAuthor: string, d_tag: string) => {
  const randomKey = generateSecretKey();
  let aliasPubKey = bytesToHex(sha256(`${30168}:${eventAuthor}:${d_tag}:${recipientPublicKey}`))
  console.log("Alias pubkey created is", aliasPubKey)
  return finalizeEvent(
    {
      kind: 1059,
      content: nip44Encrypt(
        randomKey,
        recipientPublicKey,
        JSON.stringify(event)
      ),
      created_at: now(),
      tags: [["p", aliasPubKey]],
    },
    randomKey
  ) as Event;
};

const sendToUserRelays = async (wrap: Event, pubkey: string) => {
  let pool = new SimplePool()
  const defaultRelays = getDefaultRelays();
  let RelayFilter: Filter = {
    kinds: [10050],
    authors: [pubkey]
  };
  let RelayListEvent = await pool.get(
    defaultRelays,
    RelayFilter
  );
  let RelayList = RelayListEvent?.tags
      .filter((t) => t[0] === "relay")
      .map((tag) => tag[1]);
  RelayList = RelayList || defaultRelays;
  console.log("Sending event to relays", RelayList, wrap)
  let messages = await Promise.allSettled(
    pool.publish(RelayList, wrap)
  );
  console.log("Relay replies", messages)
  pool.close(RelayList);
}

export const sendWraps = async (wraps: IWrap[]) => {
  wraps.forEach(async (wrap) => {
    sendToUserRelays(wrap.receiverWrapEvent, wrap.receiverPubkey)
    if(wrap.senderWrapEvent) {
      sendToUserRelays(wrap.senderWrapEvent, wrap.issuerPubkey)
    }
    console.log("Published gift wrap for", wrap.receiverPubkey);
  });
};

const createTag = (
  signingKey?: Uint8Array,
  voterKey?: Uint8Array,
  viewKey?: Uint8Array
) => {
  let tags: string[][] = []
  if(signingKey) {
    tags.push(["EditAccess", bytesToHex(signingKey)])
  }
  if(viewKey) {
    tags.push(["ViewAccess", bytesToHex(viewKey)])
  }
  if(voterKey) {
    tags.push(["SubmitAccess", bytesToHex(voterKey)])
  }
  return tags;
};

export const grantAccess = (
  formEvent: Event | UnsignedEvent,
  pubkey: string,
  signingKey: Uint8Array,
  viewKey?: Uint8Array,
  isEditor?: boolean
): { formEvent: Event | UnsignedEvent; wrap: IWrap } => {
  const voterKey = generateSecretKey();
  const voterId = getPublicKey(voterKey);
  const issuerPubkey = getPublicKey(signingKey);
  const formId = formEvent.tags.find((t) => t[0] === "d")?.[1]
  if(!formId) throw("Cannot grant access to a form without an Id")
  let newTags = formEvent.tags;
  newTags.push(["v", voterId]);

  const rumor = createRumor(
    {
      kind: 18,
      pubkey: issuerPubkey,
      tags: [
        ...createTag(
          isEditor ? signingKey : undefined,
          voterKey,
          viewKey ? viewKey : undefined
        ),
      ],
    },
    signingKey
  );
  const seal = createSeal(rumor, signingKey, pubkey);
  const receiverWrap = createWrap(seal, pubkey, issuerPubkey, formId);
  //const senderWrap = createWrap(seal, issuerPubkey, issuerPubkey,);

  return {
    formEvent,
    wrap: {
      receiverWrapEvent: receiverWrap,
      receiverPubkey: pubkey,
      issuerPubkey: issuerPubkey
    },
  };
};

export const acceptAccessRequests = async (
  requests: AccessRequest[],
  signingKey: string,
  formEvent: Event
) => {
  let newFormEvent: Event | UnsignedEvent = formEvent;
  let wraps: IWrap[] = [];
  requests.forEach((request) => {
    let { formEvent: newForm, wrap } = grantAccess(
      newFormEvent,
      request.pubkey,
      hexToBytes(signingKey)
    );
    newFormEvent = newForm;
    wraps.push(wrap);
  });
  newFormEvent.created_at = Math.floor(Date.now() / 1000);
  let finalEvent = finalizeEvent(newFormEvent, hexToBytes(signingKey));
  console.log("FINAL EDITED EVENT IS", finalEvent);
  const pool = new SimplePool();
  let a = await Promise.allSettled(
    pool.publish(defaultRelays, finalEvent)
  );
  console.log("Published!!!", a);
  pool.close(defaultRelays);
  await sendWraps(wraps);
};
