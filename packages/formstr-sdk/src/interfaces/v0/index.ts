export interface FormSpec {
  schemaVersion: string;
  name: string;
  fields: Array<Field>;
  description?: string;
  settings?: unknown;
}

export interface V0FormSpec {
  schemaVersion: string;
  name: string;
  fields: Array<V0Field>;
  description?: string;
  settings?: unknown;
}

export enum AnswerTypes {
  shortText = "shortText",
  paragraph = "paragraph",
  radioButton = "radioButton",
  checkboxes = "checkboxes",
  number = "number",
  date = "date",
  label = "label",
}

export enum V0AnswerTypes {
  string = "string",
  text = "text",
  singleChoice = "singleChoice",
  multipleChoice = "multipleChoice",
  number = "number",
  date = "date",
  label = "label",
}

export interface Choice {
  message: string;
  otherMessage?: boolean;
}

export interface V0Choice {
  message: string;
  otherMessage?: boolean;
  tag: string;
}

export interface NumberConstraint {
  min: number;
  max: number;
}

export interface Field {
  question: string;
  answerType: AnswerTypes;
  choices?: Array<Choice>;
  numberConstraints?: NumberConstraint;
}

export interface V0Field {
  question: string;
  tag: string;
  answerType: V0AnswerTypes;
  choices?: Array<V0Choice>;
  numberConstraints?: NumberConstraint;
}
