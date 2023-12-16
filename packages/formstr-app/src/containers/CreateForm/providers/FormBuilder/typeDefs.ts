import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { IQuestion } from "../../typeDefs";

export interface IFormBuilderContext {
  questionsList: IQuestion[],
  saveForm: () => void,
  editQuestion: (question: IQuestion, tempId: string) => void,
  addQuestion: (answerType?: AnswerTypes) => void
}