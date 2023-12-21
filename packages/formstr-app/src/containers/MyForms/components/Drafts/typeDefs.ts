export interface Draft {
  formSpec: { name: string; description: string };
  tempId: string;
}

export type IDraft = Draft & {
  onDelete: (tempId: string) => void;
};
