import {
  SimplePool,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  getSignature,
  nip19,
  nip04,
} from "nostr-tools";

export async function createForm(form) {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
  ];
  let content = JSON.stringify(form);

  let pool = new SimplePool();
  const sk = generatePrivateKey();
  const pk = getPublicKey(sk);
  let event = {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [],
    content: content,
    pubkey: pk,
  };

  event.id = getEventHash(event);
  event.sig = getSignature(event, sk);
  await pool.publish(relays, event);
  console.log("Published!!!");
  pool.close(relays);
  return [pk, sk];
}

export const getFormTemplate = async (npub) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];
  console.log("received npub", npub);
  let pool = new SimplePool();
  let filter = {
    kinds: [0],
    authors: [npub],
  };
  let kind0 = await pool.list(relays, [filter]);
  console.log("KIND0", kind0);
  pool.close(relays);
  return kind0;
};

export const sendFormResponse = async (npub, answers) => {
  console.log("FDSAFSFSAFDWS");
  console.log(npub, answers);
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
  ];
  const newSk = generatePrivateKey();
  const newPk = getPublicKey(newSk);
  const message = JSON.stringify(answers);
  const ciphertext = await nip04.encrypt(newSk, npub, message);
  let event = {
    kind: 4,
    pubkey: newPk,
    tags: [["p", npub]],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
  };
  event.id = getEventHash(event);
  event.sig = getSignature(event, newSk);
  let pool = new SimplePool();
  pool.publish(relays, event);
  console.log("Message Published");
  pool.close(relays);
};

export const getFormResponses = async (nsec) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];
  let filter = {
    kinds: [4],
    "#p": [getPublicKey(nsec)],
  };
  let pool = new SimplePool();
  let responses = await pool.list(relays, [filter]);
  console.log("responses", responses);
  responses = Promise.all(
    responses.map(async (response) => {
      let plaintext = await nip04.decrypt(
        nsec,
        response.pubkey,
        response.content
      );
      console.log("Plaaaaaain", plaintext);
      return plaintext;
    })
  );
  pool.close(relays);
  return responses;
};
//pk,sk 559ddd336a0f43867f109cc53b3fac7f53683f2e4de8d24d7ffa933d7ede2154 72031d789c1b7de052f3af0f1f129ff8878608b62b195ef2f8feea331d1bf621
