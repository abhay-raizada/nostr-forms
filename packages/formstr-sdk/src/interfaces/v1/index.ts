export interface FormSpec {
  schemaVersion: string;
  name: string;
  fields: Array<Field>;
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

export interface Choice {
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
