import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { IQuestion } from "../typeDefs";
import { makeTag } from "../../../utils/utility";

export const generateQuestion = (
  answerType: AnswerTypes = AnswerTypes.shortText
): IQuestion => {
  return {
    tempId: makeTag(6),
    question: "Click here to edit",
    answerType,
    answerSettings: {},
  };
};
