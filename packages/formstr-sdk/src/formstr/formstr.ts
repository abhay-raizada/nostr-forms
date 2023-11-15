import {
  Event,
  SimplePool,
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  nip04,
} from "nostr-tools";
import { makeTag } from "../utils/utils";
import {
  AnswerTypes,
  Field,
  FormSpec,
  V0AnswerTypes,
  V0Field,
  V0FormSpec,
} from "../interfaces";

declare global {
  // TODO: make this better
  interface Window {
    nostr: {
      getPublicKey: () => Promise<string>;
      signEvent: <Event>(
        event: Event,
      ) => Promise<Event & { id: string; sig: string }>;
      nip04: {
        encrypt: (
          pubKey: string,
          message: string,
        ) => ReturnType<typeof nip04.encrypt>;
        decrypt: (
          pubkey: string,
          nessage: string,
        ) => ReturnType<typeof nip04.decrypt>;
      };
    };
  }
}

const relays = [
  "wss://relay.damus.io/",
  "wss://relay.primal.net/",
  "wss://nos.lol/",
  "wss://relay.nostr.wirednet.jp/",
  "wss://relay.hllo.live",
];

function transformAnswerType(field: Field): V0AnswerTypes {
  const answerTypes = Object.keys(AnswerTypes);
  for (let index = 0; index < answerTypes.length; index += 1) {
    const key = answerTypes[index];
    if (field.answerType === <AnswerTypes>key) {
      return <V0AnswerTypes>Object.keys(V0AnswerTypes)[index];
    }
  }
  throw Error("Uknown Answer Type");
}

function constructV0Form(formSpec: FormSpec): V0FormSpec {
  const fields = formSpec.fields?.map((field: Field): V0Field => {
    const choices = field.choices?.map((choice) => {
      return {
        ...choice,
        tag: makeTag(6),
      };
    });

    const answerType: V0AnswerTypes = transformAnswerType(field);
    const v0Field: V0Field = { ...field, answerType, choices, tag: makeTag(6) };
    return v0Field;
  });

  return { ...formSpec, fields };
}

function checkWindowNostr() {
  if (!window?.nostr) {
    throw Error("No method provided to access nostr");
  }
}

async function encryptSavedForms(
  savedForms: string,
  userSecretKey: string | null,
) {
  const userPublicKey = await getUserPublicKey(userSecretKey);
  let ciphertext;
  if (userSecretKey) {
    ciphertext = await nip04.encrypt(userSecretKey, userPublicKey, savedForms);
  } else {
    checkWindowNostr();
    ciphertext = await window.nostr.nip04.encrypt(userPublicKey, savedForms);
  }
  return ciphertext;
}

async function decryptPastForms(
  ciphertext: string,
  userSecretKey: string | null,
) {
  const publicKey = await getUserPublicKey(userSecretKey);
  let decryptedForms;
  if (userSecretKey) {
    decryptedForms = await nip04.decrypt(userSecretKey, publicKey, ciphertext);
  } else {
    checkWindowNostr();
    decryptedForms = await window.nostr.nip04.decrypt(publicKey, ciphertext);
  }
  return decryptedForms;
}

async function getUserPublicKey(userSecretKey: string | null) {
  let userPublicKey;
  if (userSecretKey) {
    userPublicKey = getPublicKey(userSecretKey);
  } else {
    checkWindowNostr();
    userPublicKey = await window.nostr.getPublicKey();
  }
  return userPublicKey;
}

export async function getPastUserForms<FormStructure = unknown>(
  userPublicKey: string,
  userSecretKey: string | null = null,
) {
  const filters = {
    kinds: [30001],
    "#d": ["forms"],
    authors: [userPublicKey],
  };
  const pool = new SimplePool();
  const saveEvent = await pool.list(relays, [filters]);
  const decryptedForms = await decryptPastForms(
    saveEvent[0].content,
    userSecretKey,
  );
  return JSON.parse(decryptedForms) as FormStructure[];
}

export const saveFormOnNostr = async (
  formCredentials: Array<string>,
  userSecretKey: string | null = null,
) => {
  const userPublicKey = await getUserPublicKey(userSecretKey);
  const pastForms = await getPastUserForms(userPublicKey, userSecretKey);

  pastForms.push(["form", formCredentials]);
  const message = JSON.stringify(pastForms);
  const ciphertext = await encryptSavedForms(message, userSecretKey);
  const baseNip51Event = {
    kind: 30001,
    pubkey: userPublicKey,
    tags: [["d", "forms"]], //don't overwrite tags reuse previous tags
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
  };
  let nip51event: typeof baseNip51Event & { id: string; sig: string };
  if (userSecretKey) {
    nip51event = {
      ...baseNip51Event,
      id: getEventHash(baseNip51Event),
      sig: getSignature(baseNip51Event, userSecretKey),
    };
  } else {
    checkWindowNostr();
    nip51event = await window.nostr.signEvent(baseNip51Event);
  }
  const pool = new SimplePool();
  await Promise.all(pool.publish(relays, nip51event));
};

export const createForm = async (
  form: FormSpec,
  saveOnNostr = false,
  userSecretKey: string | null = null,
) => {
  const tags: string[][] = [];

  const pool = new SimplePool();
  const formSecret = generatePrivateKey();
  const formId = getPublicKey(formSecret);

  const v0Form = constructV0Form(form);
  const content = JSON.stringify(v0Form);

  const baseKind0Event: Event = {
    kind: 0,
    created_at: Math.floor(Date.now() / 1000),
    tags: tags,
    content: content,
    pubkey: formId,
    id: "",
    sig: "",
  };
  const kind0Event: Event = {
    ...baseKind0Event,
    id: getEventHash(baseKind0Event),
    sig: getSignature(baseKind0Event, formSecret),
  };
  await Promise.all(pool.publish(relays, kind0Event));
  const formCredentials = [formId, formSecret];
  if (saveOnNostr) {
    await saveFormOnNostr(formCredentials, userSecretKey);
  }
  pool.close(relays);
  return [formId, formSecret];
};
