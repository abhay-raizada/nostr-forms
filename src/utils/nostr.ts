import {generatePrivateKey, getEventHash, getPublicKey, getSignature, nip04, SimplePool,} from "nostr-tools";

declare global {
  interface Window {
    nostr: any
  }
}

// TODO: create Form Model
export async function createForm(form: any, showOnGlobal = false) {
  const relays = [
    "wss://relay.damus.io/",
    "wss://offchain.pub/",
    "wss://nos.lol/",
    "wss://relay.nostr.wirednet.jp/",
  ];
  let tags:string[][] = [];
  if (showOnGlobal) {
    tags = [["l", "formstr"]];
  }

  let pool = new SimplePool();
  const sk = generatePrivateKey();
  const pk = getPublicKey(sk);
  let content = JSON.stringify(form);
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
    ...baseKind0Event
  }
  await pool.publish(relays, kind0Event);
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
  let pool = new SimplePool();
  let filter = {
    kinds: [0],
    authors: [npub],
  };
  let kind0 = await pool.list(relays, [filter]);
  pool.close(relays);
  return kind0;
};

export const sendFormResponse = async (
  npub: string,
  // TODO: create Answers Model
  answers: any,
  nip07 = false,
  onReadPubkey = (publicKey: string) => {
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
  let baseKind4Event = {
    kind: 4,
    pubkey: publicKey,
    tags: [["p", npub]],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
  };
  let kind4Event: typeof baseKind4Event & {id:string, sig: string}
  if (nip07) {
    // @ts-ignore
    kind4Event = await window.nostr.signEvent(baseKind4Event);
    if (!kind4Event) {
      alert("Error signing event");
    }
    onEventSigned();
  } else {
    let id = getEventHash(baseKind4Event);
    let sig = getSignature(baseKind4Event, newSk);
    kind4Event = {
      ...baseKind4Event,
      id,
      sig
    }
  }

  let pool = new SimplePool();
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
  let filter = {
    kinds: [4],
    "#p": [getPublicKey(nsec)],
  };
  let pool = new SimplePool();
  let responses = Promise.all(
      (await pool.list(relays, [filter])).map(async (response) => {
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
  let filter = {
    kinds: [0],
    authors: pubkeysList,
  };
  let pool = new SimplePool();
  let responses = await pool.list(relays, [filter]);
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
  let filter = {
    kinds: [0],
    authors:[pubkey]
  }
  let pool = new SimplePool();
  let responses = await pool.list(relays, [filter]);
  let template = {}
  if(responses.length!==0){
    template = JSON.parse(responses[0].content)
  }
  pool.close(relays);
  return template;

}
