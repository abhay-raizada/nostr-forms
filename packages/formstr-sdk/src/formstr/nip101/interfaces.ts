export type Field = [
    placeholder: string,
    fieldId: string,
    dataType: string,
    label: string,
    options: string,
    config: string,
  ];

  export type Tag = string[]

  export type Option = [
    optionId: string, optionLabeL: string, optionConfig?: string
  ]

  export type Response = [
    placeholder: string, fieldId: string, response: string, metadata: string
  ]