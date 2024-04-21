import { SimplePool, nip19 } from "nostr-tools";
import { Errors, FormPassword, V1FormSpec } from "../../interfaces";
import { getDefaultRelays } from "../formstr";
import { ENCRYPTION_TYPES, EncryptionConfig } from "../../encryption";

export const fetchFormTemplate = async (
  pubKey: string,
  formIdentifier: string,
  formPassword: FormPassword
): Promise<V1FormSpec> => {
  const pool = new SimplePool();
  let formIdPubkey = pubKey;
  let relayList = getDefaultRelays();
  if (pubKey.startsWith("nprofile")) {
    const { pubkey, relays } = nip19.decode(pubKey)
      .data as nip19.ProfilePointer;
    formIdPubkey = pubkey;
    relayList = relays || relayList;
  }
  const filter = {
    kinds: [30168],
    authors: [formIdPubkey], //formId is the npub of the form
    "#d": [formIdentifier],
  };
  console.log("Fetching template", filter);
  const nostrEvent = await pool.get(relayList, filter);
  console.log("nostr event fetched is", nostrEvent);
  pool.close(relayList);
  let formTemplate;
  if (nostrEvent) {
    formTemplate = JSON.parse(nostrEvent.content);
    if (typeof formTemplate.fields === "string") {
      if (!formPassword) {
        throw new Error(Errors.FORM_PASSWORD_REQUIRED);
      }
      try {
        const formFields = JSON.parse(
          EncryptionConfig[
            formTemplate.metadata.encryption as ENCRYPTION_TYPES
          ].decryptFormContent(formTemplate.fields, formPassword)
        );
        formTemplate = {
          ...formTemplate,
          fields: formFields,
        };
      } catch {
        throw new Error(Errors.WRONG_PASSWORD);
      }
    }
  } else {
    throw Error("Form template not found");
  }
  return formTemplate;
};
