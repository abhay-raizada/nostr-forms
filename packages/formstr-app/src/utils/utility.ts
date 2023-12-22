import { DEVICE_TYPE, DEVICE_WIDTH } from "../constants/index";

export function makeTag(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function constructFormUrl(publicKey: string) {
  let hostname = window.location.host;
  if (hostname.includes("abhay-raizada")) {
    hostname += "/nostr-forms";
  }

  return `http://${hostname}/#/forms/${publicKey}`;
}

export function constructDraftUrl(
  draft: { formSpec: unknown; tempId: string } | null
) {
  if (!draft) {
    return;
  }
  let draftHash = window.btoa(JSON.stringify(draft));
  draftHash = window.encodeURIComponent(draftHash);
  const hostname = window.location.host;

  return `http://${hostname}/#/drafts/${draftHash}`;
}

export function constructResponseUrl(privateKey: string) {
  let hostname = window.location.host;
  if (hostname.includes("abhay-raizada")) {
    hostname += "/nostr-forms";
  }
  return `http://${hostname}/#/forms/${privateKey}/responses`;
}

export function copyToClipBoard(str: string) {
  navigator.clipboard.writeText(str);
}

export const getDeviceType = () => {
  const { innerWidth } = window;
  if (innerWidth <= DEVICE_WIDTH[DEVICE_TYPE.MOBILE]) {
    return DEVICE_TYPE.MOBILE;
  } else if (innerWidth <= DEVICE_WIDTH[DEVICE_TYPE.TABLET]) {
    return DEVICE_TYPE.TABLET;
  } else {
    return DEVICE_TYPE.DESKTOP;
  }
};

export const isMobile = () => getDeviceType() === DEVICE_TYPE.MOBILE;
export const isTablet = () => getDeviceType() === DEVICE_TYPE.TABLET;

