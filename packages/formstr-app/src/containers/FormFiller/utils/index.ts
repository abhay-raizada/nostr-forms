import {
  AnswerSettings,
  AnswerTypes,
  ValidationRuleTypes,
} from "@formstr/sdk/dist/interfaces";
import { ANSWER_TYPE_MAP } from "../configs";

const createRule = (answerType: AnswerTypes, val: any) => {
  let rules = [];
  if (val?.min && val?.max) {
    rules.push({
      type: ANSWER_TYPE_MAP[answerType],
      min: val.min,
      message: `Please enter number between ${val.min} and ${val.max}`,
    });
    return rules;
  }
  if (val?.min) {
    rules.push({
      type: ANSWER_TYPE_MAP[answerType],
      min: val.min,
      message:
        answerType === AnswerTypes.number
          ? `Please enter number more than ${val.min}`
          : `Please enter atleast ${val.min} chars`,
    });
  }
  if (val?.max) {
    rules.push({
      type: ANSWER_TYPE_MAP[answerType],
      max: val.max,
      message:
        answerType === AnswerTypes.number
          ? `Please enter number less than ${val.max}`
          : `Please enter less than ${val.max} chars`,
    });
  }
  return rules;
};

export const getValidationRules = (
  answerType: AnswerTypes,
  answerSettings: AnswerSettings
) => {
  let rules: { type: string; min?: number; max?: number }[] = [];
  let validationRules = answerSettings.validationRules;
  if (!validationRules) return rules;
  let ruleTypes = Object.keys(validationRules) as ValidationRuleTypes[];
  ruleTypes.forEach((ruleType) => {
    if (validationRules && validationRules[ruleType]) {
      rules.push(...createRule(answerType, validationRules[ruleType]));
    }
  });
  return rules;
};
