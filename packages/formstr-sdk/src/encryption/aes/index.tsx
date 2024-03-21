import aesjs from "aes-js";
import { generateKeyFromPassword } from "../encryptionUtils";

export const NAME = "AES";

export function encryptFormContentAes(
  plainTextFormContent: string,
  password: string,
) {
  const key = generateKeyFromPassword(password);
  const textBytes = aesjs.utils.utf8.toBytes(plainTextFormContent);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key);
  const encryptedBytes = aesCtr.encrypt(textBytes);
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

export function decryptFormContentAes(
  encryptedFormContent: string,
  password: string,
) {
  const key = generateKeyFromPassword(password);
  const textBytes = aesjs.utils.hex.toBytes(encryptedFormContent);
  const aesCtr = new aesjs.ModeOfOperation.ctr(key);
  const decryptedBytes = aesCtr.decrypt(textBytes);
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}
