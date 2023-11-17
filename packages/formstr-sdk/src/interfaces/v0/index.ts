export interface V0FormSpec {
  name: string;
  fields?: Array<V0Field>;
  description?: string;
  settings?: unknown;
}

export interface V0Field {
  question: string;
  tag: string;
  answerType: V0AnswerTypes;
  choices?: Array<V0Choice>;
  numberConstraints?: V0NumberConstraint;
}

export interface V0Choice {
  message: string;
  otherMessage?: boolean;
  tag: string;
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

export interface V0NumberConstraint {
  min: number;
  max: number;
}
