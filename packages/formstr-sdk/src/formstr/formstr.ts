import {
  Event,
  SimplePool,
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  nip04,
} from "nostr-tools";
import { detectFormVersion, makeTag } from "../utils/utils";
import { getSchema, isValidSpec } from "../utils/validators";
import {
  AnswerTypes,
  Field,
  FormSpec,
  V0AnswerTypes,
  V0Field,
  V0FormSpec,
  V1Field,
  V1FormSpec,
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

function transformAnswerType(field: V0Field): AnswerTypes {
  const answerTypes = Object.keys(V0AnswerTypes);
  for (let index = 0; index < answerTypes.length; index += 1) {
    const key = answerTypes[index];
    if (field.answerType === <V0AnswerTypes>key) {
      return <AnswerTypes>Object.keys(AnswerTypes)[index];
    }
  }
  throw Error("Uknown Answer Type");
}

function generateIds(formSpec: FormSpec): V1FormSpec {
  const fields = formSpec.fields?.map((field: Field): V1Field => {
    const choices = field.choices?.map((choice) => {
      return { ...choice, choiceId: makeTag(6) };
    });
    return { ...field, questionId: makeTag(6) };
  });
  return { ...formSpec, fields };
}

function convertV1Form(formSpec: V0FormSpec): V1FormSpec {
  const fields = formSpec.fields?.map((field: V0Field): V1Field => {
    const choices = field.choices?.map((choice) => {
      let newChoice: any = { ...choice };
      let newId = choice.tag;
      delete newChoice.tag;
      return {
        ...newChoice,
        choiceId: newId,
      };
    });
    const newField: any = { ...field };
    delete newField.tag;
    const answerType: AnswerTypes = transformAnswerType(field);
    const v1Field: V1Field = {
      ...newField,
      answerType,
      choices,
      questionId: field.tag,
    };
    return v1Field;
  });

  let finalSchema: any = { ...formSpec, schemaVersion: "v1" };
  if (fields) {
    finalSchema = { ...finalSchema, fields };
  }
  return finalSchema;
}

export const getFormTemplate = async (npub: string) => {
  const pool = new SimplePool();
  const filter = {
    kinds: [0],
    authors: [npub],
  };
  const kind0 = await pool.get(relays, filter);
  pool.close(relays);
  let formTemplate;
  if (kind0) {
    formTemplate = JSON.parse(kind0.content);
    let formVersion = detectFormVersion(formTemplate);
    if (formVersion === "v0") {
      formTemplate = convertV1Form(formTemplate);
    }
  } else {
    throw Error("Form template not found");
  }
  return formTemplate;
};

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
  pool.close(relays);
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
  let pastForms = await getPastUserForms(userPublicKey, userSecretKey);
  if (!Array.isArray(pastForms)) {
    pastForms = [];
  }
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
  pool.close(relays);
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
  try {
    isValidSpec(await getSchema("v1"), form);
  } catch (e) {
    throw Error("Invalid form spec");
  }
  const v1form = generateIds(form);
  const content = JSON.stringify(v1form);

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
