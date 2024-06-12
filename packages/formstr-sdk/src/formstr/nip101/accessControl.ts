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
import { AccesType, AccessRequest, IWrap, Tag } from "./interfaces";
import { nip44Encrypt } from "./utils";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { getDefaultRelays } from "../formstr";

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

export const sendWraps = async (wraps: IWrap[]) => {
  const pool = new SimplePool();
  const defaultRelays = getDefaultRelays();
  wraps.forEach(async (wrap) => {
    let RelayFilters: Filter = {
      kinds: [10050],
    };
    let receiverRelayFilter = RelayFilters;
    let issuerRelayFilter = RelayFilters;
    receiverRelayFilter.authors = [wrap.receiverPubkey];
    issuerRelayFilter.authors = [wrap.issuerPubkey];

    let receiverRelayListEvent = await pool.get(
      defaultRelays,
      receiverRelayFilter
    );
    let issuerRelayListEvent = await pool.get(
      defaultRelays,
      receiverRelayFilter
    );
    let receiverRelayList = receiverRelayListEvent?.tags
      .filter((t) => t[0] === "relay")
      .map((tag) => tag[1]);
    let issuerRelayList = issuerRelayListEvent?.tags
      .filter((t) => t[0] === "relay")
      .map((tag) => tag[1]);
    receiverRelayList = receiverRelayList || defaultRelays;
    await Promise.allSettled(
      pool.publish(receiverRelayList, wrap.receiverWrapEvent)
    );
    issuerRelayList = issuerRelayList || defaultRelays;
    await Promise.allSettled(
      pool.publish(issuerRelayList, wrap.senderWrapEvent)
    );
    console.log("Published gift wrap for", wrap.receiverPubkey);
  });
};

const createTag = (
  signingKey?: Uint8Array,
  voterKey?: Uint8Array,
  viewKey?: Uint8Array
) => {
  return [
    "key",
    viewKey ? bytesToHex(viewKey) : "",
    signingKey ? bytesToHex(signingKey) : "",
    voterKey ? bytesToHex(voterKey) : "",
  ];
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
  let newTags = formEvent.tags;
  newTags.push(["v", voterId]);

  const rumor = createRumor(
    {
      kind: 18,
      pubkey: issuerPubkey,
      tags: [
        createTag(
          isEditor ? signingKey : undefined,
          voterKey,
          viewKey ? viewKey : undefined
        ),
      ],
    },
    signingKey
  );
  const seal = createSeal(rumor, signingKey, pubkey);
  const receiverWrap = createWrap(seal, pubkey);
  const senderWrap = createWrap(seal, issuerPubkey);

  return {
    formEvent,
    wrap: {
      receiverWrapEvent: receiverWrap,
      receiverPubkey: pubkey,
      issuerPubkey: issuerPubkey,
      senderWrapEvent: senderWrap,
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
  await sendWraps(wraps);
  newFormEvent.created_at = Math.floor(Date.now() / 1000);
  let finalEvent = finalizeEvent(newFormEvent, hexToBytes(signingKey));
  console.log("FINAL EDITED EVENT IS", finalEvent);
  const pool = new SimplePool();
  let a = await Promise.allSettled(
    pool.publish(getDefaultRelays(), finalEvent)
  );
  console.log("Published!!!", a);
};
