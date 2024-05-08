import { Choice } from "@formstr/sdk/dist/interfaces";

export const addOption = (
  option: Choice,
  choices: Array<Choice>,
  callback: (choices: Array<Choice>) => void
) => {
  let newChoices = [...choices, option];
  callback(newChoices);
};

export const handleDelete = (
  choiceId: string,
  choices: Array<Choice>,
  callback: (choices: Array<Choice>) => void
) => {
  let newChoices = choices.filter((choice) => choice.choiceId !== choiceId);
  callback(newChoices);
};

export const handleLabelChange = (
  label: string,
  choiceId: string,
  choices: Array<Choice>,
  callback: (choices: Array<Choice>) => void
) => {
  let newChoices = choices.map((choice) => {
    if (choice.choiceId === choiceId) return { ...choice, label: label };
    return choice;
  });
  callback(newChoices);
};

export const hasOtherOption = (choices: Array<Choice>) => {
  return choices.some((choice) => {
    return choice.isOther;
  });
};
