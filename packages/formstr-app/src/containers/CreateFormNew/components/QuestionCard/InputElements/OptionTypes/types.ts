export type Choice = [choiceId: string, label: string, settings?: string];

export type ChoiceSettings = {
  isOther?: boolean;
  [key: string]: unknown;
};
