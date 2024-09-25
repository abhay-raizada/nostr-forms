export type IDeleteFormsTrigger = ({type : "local"} & IDeleteFormsLocal )|({type : "nostr"} & IDeleteFormsNostr )

export interface IDeleteFormsLocal {
    formId: string
    onDeleted: () => void
    onCancel: () => void
}

export interface IDeleteFormsNostr {
    formId: string
    onDeleted: () => void
    onCancel: () => void
}