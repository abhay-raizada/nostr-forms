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
  return `http://formstr.app/#/forms/${publicKey}`;
}

export function constructDraftUrl(draft: Record<string, unknown>) {
  let draftHash = window.btoa(JSON.stringify(draft));
  draftHash = window.encodeURIComponent(draftHash);

  return `http://formstr.app/#/drafts/${draftHash}`;
}

export function constructResponseUrl(privateKey: string) {
  return `http://formstr.app/#/forms/${privateKey}/responses`;
}
