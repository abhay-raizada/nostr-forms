export interface FormSpec {
  schemaVersion: string;
  schemaLink?: string;
  name: string;
  fields?: Array<Field>;
  description?: string;
  settings?: unknown;
  metadata?: unknown;
}

export interface V1FormSpec {
  schemaVersion: string;
  schemaLink?: string;
  name: string;
  fields?: Array<V1Field>;
  description?: string;
  settings?: unknown;
  metadata?: unknown;
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

export interface Choice {
  message: string;
  otherMessage?: boolean;
}

export interface V1Choice {
  choiceId: string;
  message: string;
  otherMessage?: boolean;
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

export interface V1Field {
  question: string;
  questionId: string;
  answerType: AnswerTypes;
  choices?: Array<Choice>;
  numberConstraints?: NumberConstraint;
}

export interface Response {
  questionId: string;
  answer: string;
  otherMessage?: string;
}
