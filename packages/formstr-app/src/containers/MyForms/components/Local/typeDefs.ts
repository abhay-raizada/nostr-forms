import { FormPassword } from "@formstr/sdk/dist/interfaces";

export interface ILocalForm {
  key: string;
  name: string;
  createdAt: string;
  publicKey: string;
  privateKey: string;
  formCredentials?: Array<string>;
  formPassword: FormPassword;
  formIdentifier?: string;
}
