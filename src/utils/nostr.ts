import { AnyAaaaRecord } from "dns";
import {
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  nip04,
  SimplePool,
} from "nostr-tools";

declare global {
  interface Window {
    nostr: any;
  }
}

const relays = [
  "wss://relay.damus.io/",
  "wss://offchain.pub/",
  "wss://nos.lol/",
  "wss://relay.nostr.wirednet.jp/",
  "wss://relay.hllo.live",
];

// TODO: create Form Model
export async function createForm(form: any, showOnGlobal = false) {
  let tags: string[][] = [];
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
    ...baseKind0Event,
  };
  await pool.publish(relays, kind0Event);
  pool.close(relays);
  return [pk, sk];
}

export const getFormTemplate = async (npub: string) => {
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
  let kind4Event: typeof baseKind4Event & { id: string; sig: string };
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
      sig,
    };
  }

  let pool = new SimplePool();
  pool.publish(relays, kind4Event);
  console.log("Message Published");
  pool.close(relays);
};

export const getFormResponses = async (nsec: string) => {
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
  let filter = {
    kinds: [0],
    authors: pubkeysList,
  };
  let pool = new SimplePool();
  let responses = await pool.list(relays, [filter]);
  pool.close(relays);
  return responses;
};

export const getUserNpubByNip07 = async () => {
  let npub = await window.nostr.getPublicKey();
  return npub;
};

export const getFormTemplatByNsec = async (nsec: string) => {
  const pubkey = getPublicKey(nsec);
  let filter = {
    kinds: [0],
    authors: [pubkey],
  };
  let pool = new SimplePool();
  let responses = await pool.list(relays, [filter]);
  let template = {};
  if (responses.length !== 0) {
    template = JSON.parse(responses[0].content);
  }
  pool.close(relays);
  return template;
};

export const getResponsesByNpub = async (npub: string, formNpub: string) => {
  let filter = {
    authors: [npub],
    "#p": [formNpub],
    kinds: [4],
  };

  let pool = new SimplePool();
  let responses = await pool.list(relays, [filter]);
  pool.close(relays);
  return responses;
};

export const getPastNostrForms = async (npub: string) => {
  let filters = {
    kinds: [30001],
    "#d": ["forms"],
    "#p": [npub],
  };
  let pool = new SimplePool();
  let responses = await pool.list(relays, [filters]);
  let plaintext_responses = responses.map(async(response) => {
    let new_response = {...response}
    new_response.content = JSON.parse(await window.nostr.nip04.decrypt(response.content));
  })
  let mergedForms: Array<string> = [];
  let finalForms = plaintext_responses.reduce((accumulator: any, response: any)=>{
    let currentValue:Array<any> = [...accumulator];
    response.content.map((t: Array<string>) => {
      if(t[0] === "form") {
        if(!mergedForms.includes(t[1])){
          mergedForms.push(t[1]);
          currentValue.push(response)
        }
      }
    })

    // if(!mergedForms.includes(response.pubkey)){
    //   mergedForms.push(response.pubkey);
    //   currentValue.push(response);
    }
    return currentValue;

  }, [])
  return finalForms;
};
export const saveFormOnNostr = async (formCredentials: any) => {
  let publicKey = await window.nostr.getPublicKey();
  let pastForms = await getPastNostrForms(publicKey) || [];
  let message = pastForms.push(["form", window.btoa(JSON.stringify(formCredentials))])
  let ciphertext = await window.nostr.nip04.encrypt(publicKey, message);
  let baseNip51Event = {
    kind: 30001,
    pubkey: publicKey,
    tags: [],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000)
  };
  return "";
};
