import {
  Event,
  SimplePool,
  generatePrivateKey,
  getEventHash,
  getPublicKey,
  getSignature,
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

const relays = [
  "wss://relay.damus.io/",
  "wss://relay.primal.net/",
  "wss://nos.lol/",
  "wss://relay.nostr.wirednet.jp/",
  "wss://relay.hllo.live",
];

function transformAnswerType(field: Field): V0AnswerTypes {
  let answerTypes = Object.keys(AnswerTypes);
  for (let index = 0; index < answerTypes.length; index += 1) {
    let key = answerTypes[index];
    if (field.answerType === <AnswerTypes>key) {
      return <V0AnswerTypes>Object.keys(V0AnswerTypes)[index];
    }
  }
  throw Error("Uknown Answer Type");
}

function constructV0Form(formSpec: FormSpec): V0FormSpec {
  let fields = formSpec.fields?.map((field: Field): V0Field => {
    let choices = field.choices?.map((choice) => {
      return {
        ...choice,
        tag: makeTag(6),
      };
    });
    let answerType: V0AnswerTypes = transformAnswerType(field);
    let v0Field: V0Field = { ...field, answerType, choices, tag: makeTag(6) };
    return v0Field;
  });

  return { ...formSpec, fields };
}

export async function createForm(form: FormSpec) {
  let tags: string[][] = [];

  const pool = new SimplePool();
  const formSecret = generatePrivateKey();
  const formId = getPublicKey(formSecret);

  let v0Form = constructV0Form(form);
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
  Promise.all(pool.publish(relays, kind0Event));
  pool.close(relays);
  return [formId, formSecret];
}
