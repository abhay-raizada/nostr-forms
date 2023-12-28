import { AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ChangeEvent } from "react";

interface InputFillerProps {
  answerType: AnswerTypes;
  answerSettings: AnswerSettings;
  onChange: (answer: string, message?: string) => void;
}

export const InputFiller: React.FC<InputFillerProps> = ({
  answerType,
  answerSettings,
  onChange,
}) => {
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  const getInput = (
    answerType: AnswerTypes,
    answerSettings: AnswerSettings
  ) => {
    const INPUT_TYPE_COMPONENT_MAP: { [key in AnswerTypes]?: JSX.Element } = {
      [AnswerTypes.shortText]: <Input onChange={handleInputChange} />,
      [AnswerTypes.paragraph]: <TextArea onChange={handleInputChange} />,
    };
    return INPUT_TYPE_COMPONENT_MAP[answerType];
  };

  return <>{getInput(answerType, answerSettings)}</>;
};
