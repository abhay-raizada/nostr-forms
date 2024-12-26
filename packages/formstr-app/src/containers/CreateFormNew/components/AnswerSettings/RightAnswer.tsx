import { AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { InputFiller } from "../../../../old/containers/FormFiller/QuestionNode/InputFiller";
import { Tooltip, Typography } from "antd";

const { Text } = Typography;

interface RightAnswerProps {
  answerType: AnswerTypes | string;
  answerSettings: AnswerSettings & {
    renderElement?: string;
  };
  choices?: string; // Moved choices to be a separate prop
  onChange: (answer: string | string[]) => void;
}

export const RightAnswer: React.FC<RightAnswerProps> = ({ 
  answerType,
  answerSettings,
  choices,
  onChange,
}) => {
  // Process choices from the separate prop
  const processedAnswerSettings = {
    ...answerSettings,
    choices: typeof choices === 'string' 
      ? JSON.parse(choices).map(([choiceId, label]: [string, string]) => ({
          choiceId,
          label
        }))
      : []
  };

  const getAnswerType = () => {
    switch (answerSettings.renderElement) {
      case 'checkboxes':
        return AnswerTypes.checkboxes;
      case 'radioButton':
        return AnswerTypes.radioButton;
      case 'dropdown':
        return AnswerTypes.dropdown;
      default:
        return answerType as AnswerTypes;
    }
  };

  return (
    <Tooltip title={
      "Select the correct answer" + 
      (answerSettings.renderElement === 'checkboxes' ? "s" : "") + 
      " for this quiz question"
    }>
      <div className="right-answer">
        <Text className="property-name">
          Right answer{answerSettings.renderElement === 'checkboxes' ? "s" : ""}
        </Text>
        <InputFiller
          defaultValue={answerSettings?.validationRules?.match?.answer}
          answerType={getAnswerType()}
          answerSettings={processedAnswerSettings}
          onChange={onChange}
        />
      </div>
    </Tooltip>
  );
};