export interface FormSpec {
  schemaVersion: string;
  schemaLink?: string;
  name: string;
  fields?: Array<Field>;
  description?: string;
  settings?: IFormSettings;
  metadata?: unknown;
}

export interface V1FormSpec {
  schemaVersion: string;
  schemaLink?: string;
  name: string;
  fields?: Array<V1Field>;
  description?: string;
  settings?: IFormSettings;
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
  label: string;
  isOther?: boolean;
}

export interface V1Choice {
  choiceId: string;
  label: string;
  isOther?: boolean;
}

export interface NumberConstraint {
  min: number;
  max: number;
}
export interface AnswerSettings {
  choices?: Array<Choice> | Array<V1Choice>;
  numberConstraints?: NumberConstraint;
  required?: boolean;
  [key: string]: unknown;
}

export interface Field {
  question: string;
  answerType: AnswerTypes;
  answerSettings: AnswerSettings;
}

export interface V1Field {
  question: string;
  questionId: string;
  answerType: AnswerTypes;
  answerSettings: AnswerSettings;
}

export interface V1Response {
  questionId: string;
  answer: string;
  message?: string;
}

export interface IFormSettings {
  titleImageUrl?: string;
  description?: boolean;
  thankYouPage?: boolean;
}