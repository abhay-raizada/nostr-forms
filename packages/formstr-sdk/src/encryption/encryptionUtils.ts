import sha256 from "sha256";

export function generateKeyFromPassword(password: string) {
  return sha256(password, { asBytes: true });
}

export function generateRandomPassword() {
  return Math.random().toString(36);
}
