import { NAME, decryptFormContentAes, encryptFormContentAes } from "./aes";

export enum ENCRYPTION_TYPES {
  AES = NAME,
}

export const EncryptionConfig: Record<
  ENCRYPTION_TYPES,
  {
    decryptFormContent: (
      encryptedFormContent: string,
      password: string,
    ) => string;
    encryptFormContent: (
      plainTextFormContent: string,
      password: string,
    ) => string;
  }
> = {
  [ENCRYPTION_TYPES.AES]: {
    decryptFormContent: decryptFormContentAes,
    encryptFormContent: encryptFormContentAes,
  },
};

export { generateRandomPassword } from "./encryptionUtils";
