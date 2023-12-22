import { IChoice } from "../types";

export const addOption = (
  option: IChoice,
  choices: Array<IChoice>,
  callback: (choices: Array<IChoice>) => void
) => {
  let newChoices = [...choices, option];
  callback(newChoices);
};

export const handleDelete = (
  tempId: string,
  choices: Array<IChoice>,
  callback: (choices: Array<IChoice>) => void
) => {
  let newChoices = choices.filter((choice) => choice.tempId !== tempId);
  callback(newChoices);
};

export const handleLabelChange = (
  label: string,
  tempId: string,
  choices: Array<IChoice>,
  callback: (choices: Array<IChoice>) => void
) => {
  let newChoices = choices.map((choice) => {
    if (choice.tempId === tempId) return { ...choice, label: label };
    return choice;
  });
  callback(newChoices);
};

export const hasOtherOption = (choices: Array<IChoice>) => {
  return choices.some((choice) => {
    return choice.isOther;
  });
};
