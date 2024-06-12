export const isValidNpub = (npub: string) => {
  return npub.length === 63 && npub.startsWith("npub1");
};
