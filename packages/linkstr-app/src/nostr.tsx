import {
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  SimplePool,
} from "nostr-tools";

declare global {
  interface Window {
    nostr: any;
  }
}

export async function createLinkCollection(collection: any) {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://relay.hllo.live",
  ];
  let tags: string[][] = [];

  let pool = new SimplePool();

  // link collection private key, signing key.
  const sk = generatePrivateKey();

  // link collection public key, pk is derivable from sk
  const pk = getPublicKey(sk);

  let content = JSON.stringify(collection);
  console.log(content);

  let baseKind0Event = {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: tags,
    content: content,
    pubkey: pk,
  };

  const kind0Event = {
    id: getEventHash(baseKind0Event),
    sig: getSignature(baseKind0Event, sk),
    ...baseKind0Event,
  };

  await pool.publish(relays, kind0Event);

  pool.close(relays);

  return [pk, sk];
}

export const getLinkCollection = async (npub: string) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
    "wss://relay.hllo.live",
  ];
  let pool = new SimplePool();

  // there is only one kind0 event of metadata event for a particular npub
  let filter = {
    kinds: [0],
    authors: [npub],
  };

  let kind0 = await pool.list(relays, [filter]);
  pool.close(relays);

  console.log(kind0);
  return kind0;
};
