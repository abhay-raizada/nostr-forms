import { AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";

export interface IProps {
  answerTypes: AnswerTypes;
  answerSettings: AnswerSettings;
  handleAnswerSettings: (answerSettings: AnswerSettings) => void;
}

export interface INumberProps {
  label: string;
  value?: number;
  onChange: (val: string) => void;
}
