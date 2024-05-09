import { SimplePool, nip19 } from "nostr-tools";
import { getDefaultRelays } from "../formstr";
import { V1FormSpec } from "../../interfaces";

export const fetchFormTemplate = async (
  pubKey: string,
  formIdentifier: string
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
  } else {
    throw Error("Form template not found");
  }
  return formTemplate;
};
