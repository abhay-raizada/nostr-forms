import { V1AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { Input, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ChangeEvent } from "react";
import { ChoiceFiller } from "./InputTypes/ChoiceFiller";
import { DropdownFiller } from "./InputTypes/DropdownFiller";
import { DateFiller } from "./InputTypes/DateFiller";
import { TimeFiller } from "./InputTypes/TimeFiller";

interface InputFillerProps {
  answerType: AnswerTypes;
  answerSettings: V1AnswerSettings;
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

  const handleValueChange = (value: string | null) => {
    if (!value) return;
    onChange(value);
  };

  const getInput = (
    answerType: AnswerTypes,
    answerSettings: V1AnswerSettings
  ) => {
    const INPUT_TYPE_COMPONENT_MAP: { [key in AnswerTypes]?: JSX.Element } = {
      [AnswerTypes.shortText]: (
        <Input
          onChange={handleInputChange}
          placeholder="Please enter your response"
        />
      ),
      [AnswerTypes.paragraph]: (
        <TextArea
          onChange={handleInputChange}
          placeholder="Please enter your response"
        />
      ),
      [AnswerTypes.number]: (
        <InputNumber
          onChange={handleValueChange}
          style={{ width: "100%" }}
          placeholder="Please enter your response"
        />
      ),
      [AnswerTypes.radioButton]: (
        <ChoiceFiller
          answerType={answerType}
          answerSettings={answerSettings}
          onChange={handleValueChange}
        />
      ),
      [AnswerTypes.checkboxes]: (
        <ChoiceFiller
          answerType={answerType}
          answerSettings={answerSettings}
          onChange={handleValueChange}
        />
      ),
      [AnswerTypes.dropdown]: (
        <DropdownFiller
          answerSettings={answerSettings}
          onChange={handleValueChange}
        />
      ),
      [AnswerTypes.date]: <DateFiller onChange={handleValueChange} />,
      [AnswerTypes.time]: <TimeFiller onChange={handleValueChange} />,
    };

    return INPUT_TYPE_COMPONENT_MAP[answerType];
  };

  return <>{getInput(answerType, answerSettings)}</>;
};
