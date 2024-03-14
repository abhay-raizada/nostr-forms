import {
  Event,
  SimplePool,
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
  nip04,
  nip19,
} from "nostr-tools";
import * as utils from "../utils/utils";
import {
  getResponseSchema,
  getSchema,
  isValidSpec,
  isValidResponse,
} from "../utils/validators";
import {
  AnswerTypes,
  Field,
  FormSpec,
  V0AnswerTypes,
  V0Field,
  V0FormSpec,
  V1Field,
  V1FormSpec,
  V1Response,
  V0Response,
  AnswerSettings,
  V1Submission,
  FormResponse,
} from "../interfaces";
import { ProfilePointer } from "nostr-tools/lib/types/nip19";
import { decryptFormContentAes, encryptFormContentAes } from "../utils/utils";

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

const defaultRelays = [
  "wss://relay.damus.io/",
  "wss://relay.primal.net/",
  "wss://nos.lol",
  "wss://relay.nostr.wirednet.jp/",
  "wss://nostr-01.yakihonne.com",
  "wss://relay.leligobit.link",
  "wss://relay.snort.social",
  "wss://relay.swisslightning.net",
  "wss://relay.hllo.live",
  "wss://relay.nostr.band",
  "wss://nostr21.com",
  "wss://relay.mutinywallet.com",
];

export const getDefaultRelays = () => {
  return defaultRelays;
};

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

export const constructFormUrl = utils.constructFormUrl;

export const constructResponseUrl = utils.constructResponseUrl;

export const constructDraftUrl = utils.constructDraftUrl;

function generateIds(formSpec: FormSpec): V1FormSpec {
  const fields = formSpec.fields?.map((field: Field): V1Field => {
    const choices = field.answerSettings?.choices?.map((choice) => {
      return { ...choice, choiceId: choice.choiceId || utils.makeTag(6) };
    });
    const answerSettings = { ...field.answerSettings, choices };
    return { ...field, questionId: utils.makeTag(6), answerSettings };
  });
  return { ...formSpec, fields };
}

function convertV1Form(formSpec: V0FormSpec): V1FormSpec {
  const fields = formSpec.fields?.map((field: V0Field): V1Field => {
    const choices = field.choices?.map((choice) => {
      const newChoice: any = { ...choice };
      const newId = choice.tag;
      delete newChoice.tag;
      return {
        label: choice.message,
        isOther: choice.otherMessage,
        choiceId: newId,
      };
    });
    const newField: any = { ...field };
    const answerSettings: AnswerSettings = {};
    if (choices) answerSettings.choices = choices;
    if (newField.numberConstraints)
      answerSettings.numberConstraints = newField.numberConstraints;

    delete newField.tag;
    delete newField.choices;
    delete newField.numberConstraints;

    const answerType: AnswerTypes = transformAnswerType(field);
    const v1Field: V1Field = {
      ...newField,
      answerType,
      answerSettings,
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

export const getFormTemplate = async (formId: string): Promise<V1FormSpec> => {
  const pool = new SimplePool();
  let formIdPubkey = formId;
  let relayList = defaultRelays;
  if (formId.startsWith("nprofile")) {
    const { pubkey, relays } = nip19.decode(formId)
      .data as nip19.ProfilePointer;
    formIdPubkey = pubkey;
    relayList = relays || defaultRelays;
  }
  const filter = {
    kinds: [0],
    authors: [formIdPubkey], //formId is the npub of the form
  };
  const kind0 = await pool.get(relayList, filter);
  pool.close(relayList);
  let formTemplate;
  if (kind0) {
    formTemplate = JSON.parse(kind0.content);
    const formVersion = utils.detectFormVersion(formTemplate);
    if (formVersion === "v0") {
      formTemplate = convertV1Form(formTemplate);
    }
    if (formTemplate?.metadata?.encryption === "aes") {
      const formPassword = "7364872yr823hd8h8";
      formTemplate = {
        ...formTemplate,
        fields: JSON.parse(
          decryptFormContentAes(formTemplate.fields, formPassword),
        ),
      };
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

async function encryptMessage(
  message: string,
  receiverPublicKey: string,
  senderSecretKey: string | null,
) {
  let ciphertext;
  if (senderSecretKey) {
    ciphertext = await nip04.encrypt(
      senderSecretKey,
      receiverPublicKey,
      message,
    );
  } else {
    checkWindowNostr();
    ciphertext = await window.nostr.nip04.encrypt(receiverPublicKey, message);
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

async function signEvent(baseEvent: Event, userSecretKey: string | null) {
  let nostrEvent;
  if (userSecretKey) {
    nostrEvent = {
      ...baseEvent,
      id: getEventHash(baseEvent),
      sig: getSignature(baseEvent, userSecretKey),
    };
  } else {
    checkWindowNostr();
    nostrEvent = await window.nostr.signEvent(baseEvent);
  }
  return nostrEvent;
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

export async function getPastUserForms<
  FormStructure = Array<string | Array<string>>,
>(userPublicKey: string, userSecretKey: string | null = null) {
  const filters = {
    kinds: [30001],
    "#d": ["forms"],
    authors: [userPublicKey],
  };
  const pool = new SimplePool();
  const saveEvent = await pool.list(defaultRelays, [filters]);
  pool.close(defaultRelays);
  if (Array.isArray(saveEvent) && !saveEvent.length)
    return saveEvent as FormStructure[];
  const decryptedForms = await decryptPastForms(
    saveEvent[0].content,
    userSecretKey,
  );
  return JSON.parse(decryptedForms) as FormStructure[];
}

export const getDecoratedPastForms = async () => {
  const userPublicKey = await getUserPublicKey(null);
  const pastForms: Array<string | Array<string>> = await getPastUserForms(
    userPublicKey,
    null,
  );
  const formTemplates = await fetchProfiles(
    pastForms.map((form) => form[1][0]),
  );
  return pastForms.map((form) => {
    const formId = form[1][0];
    const formName = formTemplates[formId]?.name || "Unknown Form";
    const formSecret = form[1][1];
    return { formId, formName, formSecret };
  });
};

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
  const ciphertext = await encryptMessage(
    message,
    userPublicKey,
    userSecretKey,
  );
  const baseNip51Event = {
    kind: 30001,
    pubkey: userPublicKey,
    tags: [["d", "forms"]], //don't overwrite tags reuse previous tags
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
    id: "",
    sig: "",
  };
  let nip51event: typeof baseNip51Event & { id: string; sig: string };
  nip51event = await signEvent(baseNip51Event, userSecretKey);
  const pool = new SimplePool();
  pool.publish(defaultRelays, nip51event);
  pool.close(defaultRelays);
};

export const createForm = async (
  form: FormSpec,
  saveOnNostr = false,
  userSecretKey: string | null = null,
  tags: Array<string[]> = [],
  relayList: Array<string> = defaultRelays,
  encodeProfile = false,
) => {
  const pool = new SimplePool();
  const formSecret = generatePrivateKey();
  const formId = getPublicKey(formSecret);
  try {
    isValidSpec(await getSchema("v1"), form);
  } catch (e) {
    throw Error("Invalid form spec" + e);
  }
  const formPassword = "7364872yr823hd8h8";
  const v1form = generateIds(form);
  const formWithEncryptedContent: Omit<V1FormSpec, "fields"> & {
    fields: string;
  } = {
    ...v1form,
    metadata: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ...v1form.metadata,
      encryption: "aes",
    },
    fields: encryptFormContentAes(JSON.stringify(v1form.fields), formPassword),
  };
  const content = JSON.stringify(formWithEncryptedContent);
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
  pool.publish(relayList, kind0Event);
  let useId = formId;
  if (encodeProfile) {
    useId = nip19.nprofileEncode({
      pubkey: formId,
      relays: relayList,
    });
  }
  const formCredentials = [useId, formSecret];
  if (saveOnNostr) {
    await saveFormOnNostr(formCredentials, userSecretKey);
  }
  pool.close(relayList);
  return formCredentials;
};

export const sendResponses = async (
  formId: string,
  responses: Array<V1Submission>,
  anonymous: boolean,
  userSecretKey: string | null = null,
) => {
  let formIdPubkey = formId;
  let relayList = defaultRelays;
  if (formId.startsWith("nprofile")) {
    const { pubkey, relays } = nip19.decode(formId)
      .data as nip19.ProfilePointer;
    formIdPubkey = pubkey;
    relayList = relays || defaultRelays;
  }
  const form = await getFormTemplate(formId);
  const questionIds = form.fields?.map((field) => field.questionId) || [];
  responses.forEach((response) => {
    if (!questionIds.includes(response.questionId)) {
      throw Error(
        `No such question ID: ${response.questionId} found in the template`,
      );
    }
  });

  const message = JSON.stringify(responses);
  let userPk = "";
  let userSk = null;
  let ciphertext;
  if (anonymous) {
    userSk = generatePrivateKey();
    userPk = getPublicKey(userSk);
  }
  if (!anonymous && userSecretKey) {
    userSk = userSecretKey;
    userPk = getPublicKey(userSk);
  }

  if (!anonymous && !userSecretKey) {
    userPk = await getUserPublicKey(userSecretKey);
  }

  ciphertext = await encryptMessage(message, formIdPubkey, userSk);
  const baseKind4Event = {
    kind: 4,
    pubkey: userPk,
    tags: [["p", formIdPubkey]],
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
    id: "",
    sig: "",
  };
  const kind4Event = await signEvent(baseKind4Event, userSk);
  const pool = new SimplePool();
  pool.publish(relayList, kind4Event);
  pool.close(relayList);
  return userPk;
};

async function getEncryptedResponses(formId: string) {
  let relayList = defaultRelays;
  let formIdPubkey = formId;
  if (formId.startsWith("nprofile")) {
    const { pubkey, relays } = nip19.decode(formId)
      .data as nip19.ProfilePointer;
    relayList = relays || defaultRelays;
    formIdPubkey = pubkey;
  }
  const pool = new SimplePool();
  const filter = {
    kinds: [4],
    "#p": [formIdPubkey],
  };
  const responses = await pool.list(relayList, [filter]);
  pool.close(relayList);
  return responses;
}

function isV0Response(response: any) {
  if (response.tag !== undefined) {
    return true;
  }
  return false;
}

function convertV1Response(response: V0Response) {
  return {
    questionId: response.tag,
    answer: response.inputValue,
    message: response.otherMessage,
  };
}

export async function fetchPublicForms() {
  const pool = new SimplePool();
  const filter = {
    kinds: [0],
    "#l": ["formstr"],
    limit: 20,
  };
  type IPublicForm = {
    content: V1FormSpec;
    pubkey: string;
  };
  const kind0s = await pool.list(defaultRelays, [filter]);
  pool.close(defaultRelays);
  const templates: IPublicForm[] = kind0s
    .map((kind0) => {
      let template = null;
      try {
        template = JSON.parse(kind0.content) as V1FormSpec;
      } catch (e) {}
      if (!template) return null;
      return { content: template, pubkey: kind0.pubkey };
    })
    .filter((template) => template !== null) as IPublicForm[];
  return templates;
}

export async function fetchProfiles(pubkeys: Array<string>) {
  const nprofileNpubMap: { [keys: string]: string } = {};
  const newPubkeys = pubkeys.map((npub) => {
    if (npub.startsWith("nprofile")) {
      const { pubkey: profilePubkey } = nip19.decode(npub)
        .data as ProfilePointer;
      nprofileNpubMap[npub] = profilePubkey;
      return profilePubkey;
    }
    return npub;
  });
  const pool = new SimplePool();
  const filter = {
    kinds: [0],
    authors: newPubkeys,
  };
  const kind0s = await pool.list(defaultRelays, [filter]);
  pool.close(defaultRelays);
  const kind0sMap = kind0s.reduce(
    (map: { [key: string]: { name: string } }, kind0) => {
      let name = "";
      try {
        name = JSON.parse(kind0.content).name;
      } catch (e) {
        name = "Anon(" + nip19.npubEncode(kind0.pubkey).slice(0, 10) + "..)";
      }
      map[kind0.pubkey] = { name };
      return map;
    },
    {},
  );
  const authors = pubkeys.reduce(
    (acc: { [key: string]: { name: string } }, p: string) => {
      let pub = p;
      if (nprofileNpubMap[p]) pub = nprofileNpubMap[p];
      acc[p] = kind0sMap[pub] || {
        name: "Anon(" + nip19.npubEncode(p).slice(0, 10) + "..)",
      };
      return acc;
    },
    {},
  );
  return authors;
}

function fillData(
  response: Array<V1Response>,
  questionMap: { [key: string]: V1Field },
) {
  return response.map((questionResponse: V1Response) => {
    const question = questionMap[questionResponse.questionId];
    if (!question) {
      questionResponse.questionLabel = "Unknown Question";
      questionResponse.displayAnswer = questionResponse.answer.toString();
      return questionResponse;
    }
    questionResponse.questionLabel = question.question;
    questionResponse.displayAnswer = getDisplayAnswer(
      questionResponse.answer,
      question,
    );
    return questionResponse;
  });
}

async function getParsedResponse(
  response: string,
  questionMap: { [key: string]: V1Field },
  createdAt: number,
) {
  let parsedResponse;
  try {
    parsedResponse = JSON.parse(response);
  } catch (e) {
    return null;
  }
  if (isV0Response(parsedResponse)) {
    parsedResponse = convertV1Response(parsedResponse);
  }
  if (!isValidResponse(await getResponseSchema("v1"), parsedResponse)) {
    return null;
  }
  parsedResponse = fillData(parsedResponse, questionMap);
  const dateObj = new Date(createdAt * 1000);
  return {
    response: parsedResponse,
    createdAt: dateObj.toDateString(),
  };
}

function createQuestionMap(formTemplate: V1FormSpec) {
  const questionMap: { [key: string]: V1Field } = {};
  formTemplate.fields?.forEach((field) => {
    questionMap[field.questionId] = field;
  });
  return questionMap;
}

const getDisplayAnswer = (
  answer: string | number | boolean,
  field: V1Field,
) => {
  return (
    field.answerSettings.choices
      ?.filter((choice) => {
        const answers = answer.toString().split(";");
        return answers.includes(choice.choiceId);
      })
      .map((choice) => choice.label)
      .join(", ") || answer.toString()
  );
};

export const sendNotification = async (
  form: V1FormSpec,
  response: Array<V1Submission>,
) => {
  let message = 'New response for form: "' + form.name + '"';
  const questionMap = createQuestionMap(form);
  message += "\n" + "Answers: \n";
  response.forEach((response) => {
    const question = questionMap[response.questionId];
    message +=
      "\n" +
      question.question +
      ": \n" +
      getDisplayAnswer(response.answer, question) +
      "\n";
  });
  message += "Visit https://formstr.app to view the responses.";
  const newSk = generatePrivateKey();
  const newPk = getPublicKey(newSk);
  const pool = new SimplePool();
  form.settings?.notifyNpubs?.forEach(async (npub) => {
    const hexNpub = nip19.decode(npub).data.toString();
    const encryptedMessage = await nip04.encrypt(newSk, hexNpub, message);
    const baseKind4Event: Event = {
      kind: 4,
      pubkey: newPk,
      tags: [["p", hexNpub]],
      content: encryptedMessage,
      created_at: Math.floor(Date.now() / 1000),
      id: "",
      sig: "",
    };
    const kind4Event = {
      ...baseKind4Event,
      id: getEventHash(baseKind4Event),
      sig: getSignature(baseKind4Event, newSk),
    };
    pool.publish(defaultRelays, kind4Event);
  });
  pool.close(defaultRelays);
};

export const getFormResponses = async (
  formSecret: string,
  nprofile?: string | null,
) => {
  const formId = nprofile ? nprofile : getPublicKey(formSecret);
  const responses = await getEncryptedResponses(formId);
  type ResponseType = {
    responses: Array<FormResponse>;
    authorName: string;
  };
  const formTemplate = await getFormTemplate(formId);
  const questionMap = createQuestionMap(formTemplate);
  const finalResponses: { [key: string]: ResponseType } = {};
  const responsesBy = responses.map((r) => r.pubkey);
  const profiles = await fetchProfiles(responsesBy);
  for (const response of responses) {
    let decryptedResponse;
    try {
      decryptedResponse = await nip04.decrypt(
        formSecret,
        response.pubkey,
        response.content,
      );
    } catch (e) {
      continue;
    }
    const parsedResponse = await getParsedResponse(
      decryptedResponse,
      questionMap,
      response.created_at,
    );
    if (!parsedResponse) continue;
    let entry = finalResponses[response.pubkey];

    if (!entry) {
      entry = {
        responses: [parsedResponse],
        authorName: "",
      };
    } else {
      entry.responses.push(parsedResponse);
    }
    finalResponses[response.pubkey] = entry;
  }
  for (const [pubkey, attrs] of Object.entries(finalResponses)) {
    attrs.authorName = profiles[pubkey].name;
  }
  return {
    allResponses: finalResponses,
    questionMap: questionMap,
    formSummary: formTemplate,
  };
};

export const getFormResponsesCount = async (formId: string) => {
  const responses = await getEncryptedResponses(formId);
  return responses.length;
};

export const syncFormsOnNostr = async (
  formCredentialsList: Array<Array<string>>,
) => {
  const publicKey = await getUserPublicKey(null);
  const pastForms = await getPastUserForms(publicKey);
  const nostrList = formCredentialsList.map((formCredentials) => {
    return ["form", formCredentials];
  });
  const syncedForms = new Set(pastForms.concat(nostrList));
  const syncedFormsList = Array.from(syncedForms);
  const message = JSON.stringify(syncedFormsList);
  const ciphertext = await encryptMessage(message, publicKey, null);
  const baseNip51Event = {
    kind: 30001,
    pubkey: publicKey,
    tags: [["d", "forms"]], //don't overwrite tags reuse previous tags
    content: ciphertext,
    created_at: Math.floor(Date.now() / 1000),
    id: "",
    sig: "",
  };
  let nip51event: typeof baseNip51Event & { id: string; sig: string };
  nip51event = await signEvent(baseNip51Event, null);
  const pool = new SimplePool();
  pool.publish(defaultRelays, nip51event);
  pool.close(defaultRelays);
};
