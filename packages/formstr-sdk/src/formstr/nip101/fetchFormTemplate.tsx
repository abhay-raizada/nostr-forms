import { Event, SimplePool, nip19 } from "nostr-tools";
import { getDefaultRelays, getUserPublicKey } from "../formstr";
import { Field, Tag } from "./interfaces";

export const fetchFormTemplate = async (
  pubKey: string,
  formIdentifier: string
): Promise<Event | null> => {
  console.log("Starting to fetch!!!!");
  const pool = new SimplePool();
  let formIdPubkey = pubKey;
  let relayList = getDefaultRelays();
  const filter = {
    kinds: [30168],
    authors: [formIdPubkey], //formId is the npub of the form
    "#d": [formIdentifier],
  };
  console.log("Fetching template....", filter);
  const nostrEvent = await pool.get(relayList, filter);
  console.log("nostr event fetched is", nostrEvent);
  pool.close(relayList);
  return nostrEvent;
};
