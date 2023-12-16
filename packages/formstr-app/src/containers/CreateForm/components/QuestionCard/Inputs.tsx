import { AnswerTypes } from "@formstr/sdk/dist/interfaces";
import ShortText from "./InputElements/ShortText";
import QuestionContext from "../QuestionContext";

interface InputsProps {
  inputType: string;
  inputSettingsHandler: (inputSettings: unknown) => void;
}

const Inputs: React.FC<InputsProps> = ({ inputType, inputSettingsHandler }) => {
  const getInputElement = () => {
    switch (inputType) {
      case AnswerTypes.shortText:
        return (
          <>
            <ShortText />
            <QuestionContext
              inputType={AnswerTypes.shortText}
              propertiesHandler={inputSettingsHandler}
            />
          </>
        );
      case AnswerTypes.number:
        break;
      default:
        <></>;
        break;
    }
  };
  return <>{getInputElement()}</>;
};

export default Inputs;
