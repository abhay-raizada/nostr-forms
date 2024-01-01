import { AnswerTypes, IFormSettings } from "@formstr/sdk/dist/interfaces";
import { IQuestion } from "../../typeDefs";

export interface IFormBuilderContext {
  questionsList: IQuestion[];
  saveForm: () => Promise<string[]>;
  closeOnOutsideClick: () => void;
  editQuestion: (question: IQuestion, tempId: string) => void;
  addQuestion: (answerType?: AnswerTypes) => void;
  deleteQuestion: (tempId: string) => void;
  questionIdInFocus?: string;
  setQuestionIdInFocus: (tempId?: string) => void;
  formSettings: IFormSettings;
  updateFormSetting: (settings: IFormSettings) => void;
  updateFormTitleImage: (e: React.FormEvent<HTMLInputElement>) => void;
  isRightSettingsOpen: boolean;
  toggleSettingsWindow: () => void;
  formName: string;
  updateFormName: (formName: string) => void;
  updateFormDescription: (e: React.FormEvent<HTMLInputElement>) => void;
  updateQuestionsList: (list: IQuestion[]) => void;
}
