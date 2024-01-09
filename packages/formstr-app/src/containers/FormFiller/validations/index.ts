import {
  AnswerSettings,
  AnswerTypes,
  MaxRule,
  MinRule,
  RangeRule,
  ValidationRuleTypes,
} from "@formstr/sdk/dist/interfaces";
import { Rule } from "antd/es/form";

//TODO: Find a method better than "any" with overloads for dynamic types
function NumRange(rule: any): Rule;
function NumRange(rule: RangeRule): Rule {
  if (!rule.min && !rule.max) {
    throw Error("Range rule must have at least a min value or a max value");
  }
  if (rule.min && !rule.max) {
    return {
      min: rule.min,
      message: `Please enter number more than ${rule.min}`,
    };
  } else if (!rule.min && rule.max) {
    return {
      max: rule.max,
      message: `Please enter number less than ${rule.max}`,
    };
  }
  return {
    min: rule.min,
    max: rule.max,
    message: `Please enter number between ${rule.min} and ${rule.max}`,
  };
}

function MinLength(rule: any): Rule;
function MinLength(rule: MinRule): Rule {
  return {
    min: rule.min,
    message: `Please enter at least ${rule.min} chars`,
  };
}

function MaxLength(rule: any): Rule;
function MaxLength(rule: MaxRule): Rule {
  return {
    max: rule.max,
    message: `Please enter less than ${rule.max} chars`,
  };
}

const RuleValidatorMap = {
  [ValidationRuleTypes.range]: NumRange,
  [ValidationRuleTypes.max]: MaxLength,
  [ValidationRuleTypes.min]: MinLength,
};

function createRule(
  ruleType: ValidationRuleTypes,
  validationRules: AnswerSettings["validationRules"]
): Rule {
  if (!validationRules) return {};
  const ruleCreator = RuleValidatorMap[ruleType];
  const rule = validationRules[ruleType];
  if (!rule) return {};
  return ruleCreator(rule);
}

export const getValidationRules = (
  answerType: AnswerTypes,
  answerSettings: AnswerSettings
) => {
  let rules: Rule[] = [];
  let validationRules = answerSettings.validationRules;
  if (!validationRules) return rules;
  let ruleTypes = Object.keys(validationRules) as ValidationRuleTypes[];
  ruleTypes.forEach((ruleType) => {
    if (validationRules && validationRules[ruleType]) {
      rules.push(createRule(ruleType, validationRules));
    }
  });
  return rules;
};
