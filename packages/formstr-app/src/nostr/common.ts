import {
  AbstractRelay,
  Event,
  finalizeEvent,
  getPublicKey,
  Relay,
  UnsignedEvent,
} from "nostr-tools";
import { normalizeURL } from "nostr-tools/utils";

declare global {
  // TODO: make this better
  interface Window {
    nostr: {
      getPublicKey: () => Promise<string>;
      signEvent: <Event>(
        event: Event
      ) => Promise<Event & { id: string; sig: string }>;
      nip04: {
        encrypt: (pubKey: string, message: string) => Promise<string>;
        decrypt: (pubkey: string, message: string) => Promise<string>;
      };
      nip44: {
        encrypt: (pubKey: string, message: string) => Promise<string>;
        decrypt: (pubkey: string, mssage: string) => Promise<string>;
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
  "wss://relay.snort.social",
  "wss://relay.nostr.band",
  "wss://nostr21.com",
];

export const getDefaultRelays = () => {
  return defaultRelays;
};

function checkWindowNostr() {
  if (!window?.nostr) {
    throw Error("No method provided to access nostr");
  }
}

export async function getUserPublicKey(userSecretKey: Uint8Array | null) {
  let userPublicKey;
  if (userSecretKey) {
    userPublicKey = getPublicKey(userSecretKey);
  } else {
    checkWindowNostr();
    userPublicKey = await window.nostr.getPublicKey();
  }
  return userPublicKey;
}

export async function signEvent(
  baseEvent: UnsignedEvent,
  userSecretKey: Uint8Array | null
) {
  let nostrEvent;
  if (userSecretKey) {
    nostrEvent = finalizeEvent(baseEvent, userSecretKey);
  } else {
    checkWindowNostr();
    nostrEvent = await window.nostr.signEvent(baseEvent);
  }
  return nostrEvent;
}

export const customPublish = (
  relays: string[],
  event: Event,
  acceptedRelays?: (relay: string) => void
): Promise<string>[] => {
  return relays.map(normalizeURL).map(async (url, i, arr) => {
    if (arr.indexOf(url) !== i) {
      // duplicate
      return Promise.reject("duplicate url");
    }

    let r = await ensureRelay(url);
    return r.publish(event).then((reason) => {
      console.log("accepted relays", url);
      acceptedRelays?.(url);
      return reason;
    });
  });
};

export const ensureRelay = async (
  url: string,
  params?: { connectionTimeout?: number }
): Promise<AbstractRelay> => {
  url = normalizeURL(url);

  let relay = new Relay(url);
  if (params?.connectionTimeout)
    relay.connectionTimeout = params.connectionTimeout;
  await relay.connect();

  return relay;
};
