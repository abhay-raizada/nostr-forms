import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { IQuestion } from "../../typeDefs";

export interface IFormBuilderContext {
  questionsList: IQuestion[];
  saveForm: () => void;
  editQuestion: (question: IQuestion, tempId: string) => void;
  addQuestion: (answerType?: AnswerTypes) => void;
  deleteQuestion: (tempId: string) => void;
  questionIdInFocus?: string;
  setQuestionIdInFocus: (tempId?: string) => void;
  formSettings: IFormSettings;
  updateFormSetting: (settings: IFormSettings) => void;
}

export interface IFormSettings {
  titleImage?: boolean;
  description?: boolean;
  thankYouPage?: boolean;
}
