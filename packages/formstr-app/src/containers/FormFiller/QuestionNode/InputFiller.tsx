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
    switch (answerType) {
      case AnswerTypes.shortText:
        return <Input onChange={handleInputChange} />;
      case AnswerTypes.paragraph:
        return <TextArea onChange={handleInputChange} />;
    }
  };

  return <>{getInput(answerType, answerSettings)}</>;
};
