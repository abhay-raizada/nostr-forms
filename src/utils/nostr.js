import {
  SimplePool,
  generatePrivateKey,
  getPublicKey,
  getEventHash,
  getSignature,
  nip04,
} from "nostr-tools";

export async function createForm(form) {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
  ];

  let pool = new SimplePool();
  const sk = generatePrivateKey();
  const pk = getPublicKey(sk);
  let content = JSON.stringify(form);
  let event = {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["l", "formstr"]],
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

export const sendFormResponse = async (
  npub,
  answers,
  nip07 = false,
  onReadPubkey = (publicKey) => {
    return publicKey;
  },
  onEncryptedResponse = () => {},
  onEventSigned = () => {}
) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
  ];
  const newSk = generatePrivateKey();
  const newPk = getPublicKey(newSk);
  const message = JSON.stringify(answers);
  //const ciphertext =
  let ciphertext = "";
  let publicKey = "";

  if (nip07) {
    publicKey = await window.nostr.getPublicKey();
    if (!publicKey) {
      alert("A nip07 extension is required to fill this form");
    }
    onReadPubkey(publicKey);
    ciphertext = await window.nostr.nip04.encrypt(npub, message);
    if (!ciphertext) {
      alert("Please encrypt your response");
    }
    onEncryptedResponse();
    // async window.nostr.signEvent(event)
  }
  publicKey = publicKey || newPk;
  ciphertext = ciphertext || (await nip04.encrypt(newSk, npub, message));
  let kind4Event = {
    kind: 4,
    pubkey: publicKey,
    tags: [["p", npub]],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
  };
  if (nip07) {
    kind4Event = await window.nostr.signEvent(kind4Event);
    if (!kind4Event) {
      alert("Error signing event");
    }
    onEventSigned();
  } else {
    kind4Event.id = getEventHash(kind4Event);
    kind4Event.sig = getSignature(kind4Event, newSk);
  }

  let pool = new SimplePool();
  pool.publish(relays, kind4Event);
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
  responses = Promise.all(
    responses.map(async (response) => {
      let plaintext = await nip04.decrypt(
        nsec,
        response.pubkey,
        response.content
      );
      return { plaintext: plaintext, pubkey: response.pubkey };
    })
  );
  pool.close(relays);
  return responses;
};

export const fetchGlobalFeed = async () => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];
  let filter = {
    kinds: [0],
    "#l": ["formstr"],
    limit: 20,
  };
  let pool = new SimplePool();
  let responses = await pool.list(relays, [filter]);
  return responses;
};
