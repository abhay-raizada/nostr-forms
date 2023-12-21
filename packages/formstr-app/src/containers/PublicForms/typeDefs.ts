import { V1FormSpec } from "@formstr/sdk/dist/interfaces";

export interface IPublicForm {
  content: string;
  pubkey: string;
}

export type IV1FormSpec = V1FormSpec & {
  pubkey: string;
};
