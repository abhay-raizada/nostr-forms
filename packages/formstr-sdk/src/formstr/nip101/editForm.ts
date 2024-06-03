import {
  Event,
  SimplePool,
  UnsignedEvent,
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
} from "nostr-tools";
import { AccesType, AccessRequest, Tag } from "./interfaces";
import { nip44Encrypt } from "./utils";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { getDefaultRelays } from "../formstr";

const hasKeyTagAccess = (keyTag: Tag, accessType: AccesType) => {
  let ACCESS_TYPE_KEY_INDEX_MAP = {
    vote: 4,
    edit: 3,
    view: 2,
  };
  return !!keyTag[ACCESS_TYPE_KEY_INDEX_MAP[accessType]];
};

const createTag = (
  signingKey: string,
  pubKey: string,
  accessType: AccesType
) => {
  let encryptedEditKey;
  let encryptedViewKey;
  let encryptedVoteKey;
  let voterId;
  if (accessType === "vote") {
    let voterKey = generateSecretKey();
    voterId = getPublicKey(voterKey);
    encryptedVoteKey = nip44Encrypt(voterKey, pubKey, bytesToHex(voterKey));
  }
  if (accessType === "edit") {
    encryptedEditKey = nip44Encrypt(hexToBytes(signingKey), pubKey, signingKey);
  }
  return {
    tag: [
      "key",
      pubKey,
      encryptedViewKey || "",
      encryptedEditKey || "",
      encryptedVoteKey || "",
    ],
    voterId,
  };
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
): UnsignedEvent => {
  let createNewTag = true;
  let votingId;
  let newTags = formEvent.tags.map((tag: Tag) => {
    if (tag[0] === "key" && tag[1] === pubkey) {
      createNewTag = false;
      if (hasKeyTagAccess(tag, accessType)) return tag;
      else {
        let { tag: keyTag, voterId } = modifyKeyTag(
          tag,
          accessType,
          signingKey
        );
        votingId = voterId;
        return keyTag;
      }
    }
    return tag;
  });
  if (createNewTag) {
    let { tag: keyTag, voterId } = createTag(signingKey, pubkey, accessType);
    newTags.push(keyTag);
    newTags.push(["p", pubkey]);
    votingId = voterId;
  }
  if (votingId) newTags.push(["v", votingId]);
  let newFormEvent: any = { ...formEvent, tags: newTags };
  delete newFormEvent.id;
  delete newFormEvent.sig;

  return newFormEvent;
};

export const acceptAccessRequests = async (
  requests: AccessRequest[],
  signingKey: string,
  formEvent: Event
) => {
  let newFormEvent: Event | UnsignedEvent = formEvent;
  requests.forEach((request) => {
    newFormEvent = grantAccess(
      newFormEvent,
      request.pubkey,
      request.accessType,
      signingKey
    );
  });
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
