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

export const isGreaterThanOrEqual = (val: number, compareVal: number) =>
  val >= compareVal;

export const isLessThanOrEqual = (val: number, compareVal: number) =>
  val <= compareVal;

export const getNumValue = (val: string | number): number => {
  let newVal = val;
  if (typeof newVal === "string") {
    newVal = newVal.length;
  }
  return newVal;
};
