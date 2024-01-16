import { FormSpec } from "@formstr/sdk/dist/interfaces";

export interface Draft {
  formSpec: FormSpec;
  tempId: string;
}

export type IDraft = Draft & {
  onDelete: (tempId: string) => void;
};
