export const isChoiceType = (answerType) => {
  return ["singleChoice", "multipleChoice"].includes(answerType);
};

export const isNumberType = (answerType) => {
  return ["number"].includes(answerType);
};
