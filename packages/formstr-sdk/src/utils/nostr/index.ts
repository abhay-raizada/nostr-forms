import {
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  nip04,
  SimplePool,
} from "nostr-tools";

declare global {
  // TODO: make this better
  interface Window {
    nostr: {
      getPublicKey: () => Promise<string>;
      // TODO: add constraints on Event type
      signEvent: <Event>(
        event: Event,
      ) => Promise<Event & { id: string; sig: string }>;
      nip04: {
        encrypt: (
          pubKey: string,
          message: string,
        ) => ReturnType<typeof nip04.encrypt>;
      };
    };
  }
}

// TODO: create Form Model
export async function createForm(form: unknown, showOnGlobal = false) {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
  ];
  let tags: string[][] = [];
  if (showOnGlobal) {
    tags = [["l", "formstr"]];
  }

  const pool = new SimplePool();
  const sk = generatePrivateKey();
  const pk = getPublicKey(sk);
  const content = JSON.stringify(form);
  const baseKind0Event = {
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
  // form creation par fat ta tha is vajah se
  // linting se bug mila :)
  await Promise.all(pool.publish(relays, kind0Event));
  pool.close(relays);
  return [pk, sk];
}

export const getFormTemplate = async (npub: string) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];
  console.log("received npub", npub);
  const pool = new SimplePool();
  const filter = {
    kinds: [0],
    authors: [npub],
  };
  const kind0 = await pool.list(relays, [filter]);
  pool.close(relays);
  return kind0;
};

export const sendFormResponse = async (
  npub: string,
  // TODO: create Answers Model
  answers: unknown,
  nip07 = false,
  onReadPubkey = (publicKey: string) => {
    return publicKey;
  },
  onEncryptedResponse?: () => void,
  onEventSigned?: () => void,
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
    onEncryptedResponse?.();
    // async window.nostr.signEvent(event)
  }
  publicKey = publicKey || newPk;
  ciphertext = ciphertext || (await nip04.encrypt(newSk, npub, message));
  const baseKind4Event = {
    kind: 4,
    pubkey: publicKey,
    tags: [["p", npub]],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
  };
  let kind4Event: typeof baseKind4Event & { id: string; sig: string };
  if (nip07) {
    kind4Event = await window.nostr.signEvent(baseKind4Event);
    if (!kind4Event) {
      alert("Error signing event");
    }
    onEventSigned?.();
  } else {
    const id = getEventHash(baseKind4Event);
    const sig = getSignature(baseKind4Event, newSk);
    kind4Event = {
      ...baseKind4Event,
      id,
      sig,
    };
  }

  const pool = new SimplePool();
  pool.publish(relays, kind4Event);
  console.log("Message Published");
  pool.close(relays);
};

export const getFormResponses = async (nsec: string) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];
  const filter = {
    kinds: [4],
    "#p": [getPublicKey(nsec)],
  };
  const pool = new SimplePool();
  const responses = Promise.all(
    (await pool.list(relays, [filter])).map(async (response) => {
      const plaintext = await nip04.decrypt(
        nsec,
        response.pubkey,
        response.content,
      );
      return { plaintext: plaintext, pubkey: response.pubkey };
    }),
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
  const filter = {
    kinds: [0],
    "#l": ["formstr"],
    limit: 20,
  };
  const pool = new SimplePool();
  const responses = await pool.list(relays, [filter]);
  pool.close(relays);
  return responses;
};

export const getUserKind0s = async (pubkeysList: Array<string>) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];
  const filter = {
    kinds: [0],
    authors: pubkeysList,
  };
  const pool = new SimplePool();
  const responses = await pool.list(relays, [filter]);
  pool.close(relays);
  return responses;
};

export const getFormTemplatByNsec = async (nsec: string) => {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
    "wss://nostr.wine/",
  ];
  const pubkey = getPublicKey(nsec);
  const filter = {
    kinds: [0],
    authors: [pubkey],
  };
  const pool = new SimplePool();
  const responses = await pool.list(relays, [filter]);
  let template = {};
  if (responses.length !== 0) {
    template = JSON.parse(responses[0].content) as Record<string, unknown>;
  }
  pool.close(relays);
  return template;
};
