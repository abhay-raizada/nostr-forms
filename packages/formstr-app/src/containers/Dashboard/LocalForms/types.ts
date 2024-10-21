export type IDeleteFormsTrigger = IDeleteFormsLocal;

export interface IDeleteFormsLocal {
  formKey: string;
  onDeleted: () => void;
  onCancel: () => void;
}

export interface IDeleteFormsNostr {
  key: string;
  onDeleted: () => void;
  onCancel: () => void;
}
