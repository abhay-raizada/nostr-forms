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
  return {
    validator: (_: any, value: any) => {
      if (!rule.min && !rule.max) return Promise.resolve();
      if (rule.min && value[0] < rule.min) {
        return Promise.reject(`Please enter number more than ${rule.min}`);
      }
      if (rule.max && value[0] > rule.max) {
        return Promise.reject(`Please enter number less than ${rule.max}`);
      }
      return Promise.resolve();
    },
  };
}

function MinLength(rule: any): Rule;
function MinLength(rule: MinRule): Rule {
  return {
    validator: (_: any, value: any) => {
      if (!rule.min) return Promise.resolve();
      if (value[0].length < rule.min) {
        return Promise.reject(`Please enter more than ${rule.min} chars`);
      }
      return Promise.resolve();
    },
  };
}

function MaxLength(rule: any): Rule;
function MaxLength(rule: MaxRule): Rule {
  return {
    validator: (_: any, value: any) => {
      if (!rule.max) return Promise.resolve();
      if (value[0].length > rule.max) {
        return Promise.reject(`Please enter less than ${rule.max} chars`);
      }
      return Promise.resolve();
    },
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
