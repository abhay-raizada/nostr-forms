import { AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import ShortText from "./InputElements/ShortText";
import QuestionContext from "../QuestionContext";
import { RadioButtonCreator } from "./InputElements/RadioButtonCreator";
import { makeTag } from "../../../../utils/utility";

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
  const handleProperties = (properties: unknown) => {};

  const updateAnswerSettings = (key: string, property: unknown) => {
    let newAnswerSettings = { ...answerSettings, key: property };
    answerSettingsHandler(newAnswerSettings);
  };
  const getInputElement = () => {
    switch (inputType) {
      case AnswerTypes.shortText:
        return (
          <>
            <ShortText />
            <QuestionContext
              inputType={AnswerTypes.shortText}
              propertiesHandler={handleProperties}
            />
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
      default:
        <></>;
        break;
    }
  };
  return <>{getInputElement()}</>;
};

export default Inputs;
