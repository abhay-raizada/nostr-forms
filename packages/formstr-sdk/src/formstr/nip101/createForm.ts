import { SimplePool, UnsignedEvent, nip19 } from "nostr-tools";
import { FormSpec, V1FormSpec } from "../../interfaces";
import {
  generateIds,
  getDefaultRelays,
  getUserPublicKey,
  saveFormOnNostr,
  signEvent,
} from "../formstr";
import { getSchema, isValidSpec } from "../../utils/validators";
import { bytesToHex } from "@noble/hashes/utils";
import { AnswerTypes } from "../../interfaces";
import { makeTag } from "../../utils/utils";

const defaultRelays = getDefaultRelays();

export const createForm = async (
  form: FormSpec,
  saveOnNostr = false,
  userSecretKey: Uint8Array | null,
  relayList: Array<string> = defaultRelays,
  encodeProfile = false,
  formPassword: string | null,
  formIdentifier: string
) => {
  const pool = new SimplePool();
  try {
    isValidSpec(await getSchema("v1"), form);
  } catch (e) {
    throw Error("Invalid form spec" + e);
  }
  let userPubkey = await getUserPublicKey(userSecretKey);
  let formContent = [];

  formContent.push(["name", form.name]);
  formContent.push(["description", form.description]);
  formContent.push(["formConfig", JSON.stringify(form.settings)]);
  form.fields?.forEach((field) => {
    if (
      ![
        AnswerTypes.checkboxes,
        AnswerTypes.radioButton,
        AnswerTypes.dropdown,
      ].includes(field.answerType)
    ) {
      formContent.push([
        "textField",
        makeTag(6),
        field.question,
        JSON.stringify(field.answerSettings),
      ]);
    } else {
      formContent.push(
        "optionsField",
        makeTag(6),
        field.question,
        field.answerSettings.choices
      );
    }
  });
  const baseTemplateEvent: UnsignedEvent = {
    kind: 30168,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["d", formIdentifier]],
    content: "",
    pubkey: userPubkey,
  };
  console.log("event is ", baseTemplateEvent);
  // const templateEvent = await signEvent(baseTemplateEvent, userSecretKey);
  // console.log("final event is ", templateEvent);
  // await Promise.allSettled(pool.publish(relayList, templateEvent));
  // let useId = userPubkey;
  // if (encodeProfile) {
  //   useId = nip19.nprofileEncode({
  //     pubkey: useId,
  //     relays: relayList,
  //   });
  // }
  // let formCredentials = null;
  // if (userSecretKey) {
  //   formCredentials = [useId, bytesToHex(userSecretKey)];
  // }
  // pool.close(relayList);
  // if (!formPassword) return [useId, useId];
  return ["", ""];
};
