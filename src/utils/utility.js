export function makeTag(length) {
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

export function constructFormUrl(publicKey) {
  let hostname = window.location.host;
  if (hostname.includes("abhay-raizada")) {
    hostname += "/nostr-forms";
  }

  return "http://" + hostname + "/#/forms/" + publicKey;
}
