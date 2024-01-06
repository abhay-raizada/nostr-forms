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
  settings?: IFormSettings;
  metadata?: unknown;
}

export enum AnswerTypes {
  shortText = "shortText",
  paragraph = "paragraph",
  radioButton = "radioButton",
  checkboxes = "checkboxes",
  dropdown = "dropdown",
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

export enum ValidationRuleTypes {
  range = "range",
  max = "max",
  min = "min",
}

export interface RangeRule {
  min: number;
  max: number;
}

export interface MaxRule {
  max: number;
}

export interface MinRule {
  min: number;
}

export interface AnswerSettings {
  choices?: Array<Choice>;
  numberConstraints?: NumberConstraint;
  required?: boolean;
  validationRules?: {
    [ValidationRuleTypes.range]?: RangeRule;
    [ValidationRuleTypes.max]?: MaxRule;
    [ValidationRuleTypes.min]?: MinRule;
  };
  [key: string]: unknown;
}

export interface V1AnswerSettings {
  choices?: Array<V1Choice>;
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
  answerSettings: V1AnswerSettings;
}

export interface V1Response {
  questionId: string;
  questionLabel: string;
  answer: string;
  displayAnswer: string;
  message?: string;
}

export interface V1Submission {
  questionId: string;
  answer: string;
  message?: string;
}

export interface FormResponse {
  [pubkey: string]: {
    responses: Array<Array<V1Response>>;
    authorName: string;
  };
}

export interface IFormSettings {
  titleImageUrl?: string;
  description?: string;
  thankYouPage?: boolean;
}
