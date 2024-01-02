import { AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import ShortText from "./InputElements/ShortText";
import { RadioButtonCreator } from "./InputElements/OptionTypes/RadioButtonCreator";
import { makeTag } from "../../../../utils/utility";
import { CheckboxCreator } from "./InputElements/OptionTypes/CheckBoxCreator";
import { DropdownCreator } from "./InputElements/OptionTypes/DropdownCreator";
import { DatePicker } from "antd";

interface InputsProps {
  inputType: string;
  answerSettings: AnswerSettings;
  answerSettingsHandler: (answerSettings: AnswerSettings) => void;
}

const Inputs: React.FC<InputsProps> = ({
  inputType,
  answerSettings,
  answerSettingsHandler,
}) => {
  const updateAnswerSettings = (settingKey: string, property: unknown) => {
    let newAnswerSettings = { ...answerSettings, [settingKey]: property };
    answerSettingsHandler(newAnswerSettings);
  };
  const getInputElement = () => {
    switch (inputType) {
      case AnswerTypes.shortText:
        return (
          <>
            <ShortText />
          </>
        );
      case AnswerTypes.number:
        break;

      case AnswerTypes.radioButton:
        return (
          <RadioButtonCreator
            initialValues={answerSettings.choices?.map((c) => {
              return { label: c.label, isOther: c.isOther, tempId: makeTag(6) };
            })}
            onValuesChange={updateAnswerSettings}
          />
        );
      case AnswerTypes.checkboxes:
        return (
          <CheckboxCreator
            initialValues={answerSettings.choices?.map((c) => {
              return { label: c.label, isOther: c.isOther, tempId: makeTag(6) };
            })}
            onValuesChange={updateAnswerSettings}
          />
        );
      case AnswerTypes.dropdown:
        return (
          <DropdownCreator
            initialValues={answerSettings.choices?.map((c) => {
              return { label: c.label, isOther: c.isOther, tempId: makeTag(6) };
            })}
            onValuesChange={updateAnswerSettings}
          />
        );
      case AnswerTypes.date:
        return <DatePicker disabled={true} />;
      default:
        <></>;
        break;
    }
  };
  return <>{getInputElement()}</>;
};

export default Inputs;
