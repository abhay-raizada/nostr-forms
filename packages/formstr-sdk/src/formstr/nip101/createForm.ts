import {
  SimplePool,
  UnsignedEvent,
  generateSecretKey,
  getPublicKey,
  nip19,
  nip44,
} from "nostr-tools";
import { getDefaultRelays, getUserPublicKey, signEvent } from "../formstr";
import { bytesToHex } from "@noble/hashes/utils";
import { Tag } from "./interfaces";
import { nip44Encrypt } from "./utils";

const defaultRelays = getDefaultRelays();

const getKeysTag = (
  isPoll: boolean,
  isParticipant: boolean,
  isEditor: boolean,
  viewKey: Uint8Array,
  signingKey: Uint8Array,
  pubkey: string
) => {
  let npubHex = nip19.decode(pubkey).data as string;
  let encryptedViewKey = "";
  let encryptedVoteKey = "";
  let voterId = "";
  if (isParticipant) {
    encryptedViewKey = nip44Encrypt(signingKey, npubHex, bytesToHex(viewKey));
    if (isPoll) {
      let votingKey = generateSecretKey();
      encryptedVoteKey = nip44Encrypt(
        votingKey,
        npubHex,
        bytesToHex(votingKey)
      );
      voterId = getPublicKey(votingKey);
    }
  }
  let encryptedEditKey = "";
  if (isEditor) {
    encryptedEditKey = nip44Encrypt(
      signingKey,
      npubHex,
      bytesToHex(signingKey)
    );
  }
  return {
    tag: ["key", npubHex, encryptedViewKey, encryptedEditKey, encryptedVoteKey],
    voterId,
  };
};

interface MergedNpub {
  pubkey: string;
  isParticipant?: boolean;
  isEditor?: boolean;
}

const getMergedNpubs = (
  viewList: Set<string>,
  editList: Set<string>
): MergedNpub[] => {
  let ViewNpubs = Array.from(viewList).map((pubKey) => {
    return {
      pubkey: pubKey,
      isParticipant: true,
    };
  });

  let EditNpubs = Array.from(editList).map((pubKey) => {
    return {
      pubkey: pubKey,
      isEditor: true,
    };
  });

  const map = new Map();
  ViewNpubs.forEach((item) => map.set(item.pubkey, item));
  EditNpubs.forEach((item) =>
    map.set(item.pubkey, { ...map.get(item.pubkey), ...item })
  );
  return Array.from(map.values());
};

export const createForm = async (
  form: Array<Tag>,
  relayList: Array<string> = defaultRelays,
  viewList: Set<string>,
  EditList: Set<string>,
  encryptContent?: boolean,
  poll?: boolean
) => {
  const pool = new SimplePool();
  let signingKey = await generateSecretKey();
  let formPubkey = await getUserPublicKey(signingKey);

  let tags: Tag[] = [];
  let formId = form.find((tag: Tag) => tag[0] === "d")?.[1];
  if (!formId) {
    throw Error("Invalid Form: No formId found");
  }
  let name = form.find((tag: Tag) => tag[0] === "name")?.[1] || "";
  let mergedNpubs = getMergedNpubs(viewList, EditList);
  let viewKey = generateSecretKey();
  tags.push(["d", formId]);
  tags.push(["name", name]);
  mergedNpubs.forEach((profile: MergedNpub) => {
    let { tag, voterId } = getKeysTag(
      !!poll,
      !!profile.isParticipant,
      !!profile.isEditor,
      viewKey,
      signingKey,
      profile.pubkey
    );
    tags.push(tag);
    if (poll) tags.push(["v", voterId]);
    tags.push(["p", nip19.decode(profile.pubkey).data as string]);
  });

  let content = "";
  if (encryptContent)
    content = nip44Encrypt(
      signingKey,
      getPublicKey(viewKey),
      JSON.stringify(form)
    );
  else {
    tags = [
      ...tags,
      ...form.filter((tag: Tag) => !["d", "name"].includes(tag[0])),
    ];
  }

  const baseTemplateEvent: UnsignedEvent = {
    kind: 30168,
    created_at: Math.floor(Date.now() / 1000),
    tags: tags,
    content: content,
    pubkey: formPubkey,
  };

  const templateEvent = await signEvent(baseTemplateEvent, signingKey);
  console.log("final event is ", templateEvent);
  await Promise.allSettled(pool.publish(relayList, templateEvent)).then(
    () => {},
    (reason: string) => {
      console.log("Errors are here", reason);
    }
  );
  pool.close(relayList);
  return signingKey;
};
