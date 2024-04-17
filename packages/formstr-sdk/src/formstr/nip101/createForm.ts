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
import { EncryptionConfig } from "../../encryption";

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
  const v1form = generateIds(form);
  let userPubkey = await getUserPublicKey(userSecretKey);
  let formContent:
    | V1FormSpec
    | (Omit<V1FormSpec, "fields"> & {
        fields: string;
      }) = v1form;
  // if (formPassword) {
  //   const formWithEncryptedContent: Omit<V1FormSpec, "fields"> & {
  //     fields: string;
  //   } = {
  //     ...v1form,
  //     fields: EncryptionConfig["AES"].encryptFormContent(
  //       JSON.stringify(v1form.fields),
  //       formPassword
  //     ),
  //   };
  //   formContent = formWithEncryptedContent;
  // }
  const content = JSON.stringify(form);
  const baseTemplateEvent: UnsignedEvent = {
    kind: 30168,
    created_at: Math.floor(Date.now() / 1000),
    tags: [["d", formIdentifier]],
    content: content,
    pubkey: userPubkey,
  };
  const templateEvent = await signEvent(baseTemplateEvent, userSecretKey);
  console.log("final event is ", templateEvent);
  await Promise.allSettled(pool.publish(relayList, templateEvent));
  let useId = userPubkey;
  if (encodeProfile) {
    useId = nip19.nprofileEncode({
      pubkey: useId,
      relays: relayList,
    });
  }
  let formCredentials = null;
  if (userSecretKey) {
    formCredentials = [useId, bytesToHex(userSecretKey)];
  }
  if (saveOnNostr && formCredentials) {
    await saveFormOnNostr(formCredentials, userSecretKey, formPassword);
  }
  pool.close(relayList);
  if (!formPassword) return [useId, useId];
  else return [useId, useId];
};
