import { AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { InputFiller } from "../../../../old/containers/FormFiller/QuestionNode/InputFiller";
import { Tooltip, Typography, Select } from "antd";

const { Text } = Typography;
const { Option } = Select;

type ChoiceItem = [string, string];

interface RightAnswerProps {
  answerType: AnswerTypes | string;
  answerSettings: AnswerSettings & {
    renderElement?: string;
    choices?: string;
  };
  onChange: (answer: string | string[]) => void;
}

export const RightAnswer: React.FC<RightAnswerProps> = ({
  answerType,
  answerSettings,
  onChange,
}) => {
  const getChoices = (): ChoiceItem[] => {
    try {
      if (typeof answerSettings.choices === 'string') {
        return JSON.parse(answerSettings.choices);
      }
      return [];
    } catch (e) {
      console.error('Error parsing choices:', e);
      return [];
    }
  };

  const renderAnswerInput = () => {
    const currentAnswer = answerSettings?.validationRules?.match?.answer;
    const renderElement = answerSettings.renderElement;
    
    if (renderElement === 'checkboxes') {
      const choices = getChoices();
      
      const currentAnswers = currentAnswer 
        ? Array.isArray(currentAnswer)
          ? currentAnswer
          : typeof currentAnswer === 'string'
            ? currentAnswer.split(',')
            : []
        : [];

      return (
        <Select
          className="right-answer-select"
          placeholder="Select correct answers"
          mode="multiple"
          value={currentAnswers.map(String)}
          onChange={(values) => onChange(values)}
          style={{ width: '100%' }}
        >
          {choices.map(([choiceId, label]) => (
            <Option key={choiceId} value={choiceId}>
              {label}
            </Option>
          ))}
        </Select>
      );
    }

    if (renderElement === 'radioButton' || renderElement === 'dropdown') {
      const choices = getChoices();
      
      return (
        <Select
          className="right-answer-select"
          placeholder="Select correct answer"
          value={currentAnswer ? String(currentAnswer) : undefined}
          onChange={(value) => onChange(value)}
          style={{ width: '100%' }}
        >
          {choices.map(([choiceId, label]) => (
            <Option key={choiceId} value={choiceId}>
              {label}
            </Option>
          ))}
        </Select>
      );
    }

    return (
      <InputFiller
        defaultValue={currentAnswer}
        answerType={answerType as AnswerTypes}
        answerSettings={answerSettings}
        onChange={onChange}
      />
    );
  };

  return (
    <Tooltip title={
      "Select the correct answer" + 
      (answerSettings.renderElement === 'checkboxes' ? "s" : "") + 
      " for this quiz question"
    }>
      <div className="right-answer">
        <Text className="property-name">Right answer{answerSettings.renderElement === 'checkboxes' ? "s" : ""}</Text>
        {renderAnswerInput()}
      </div>
    </Tooltip>
  );
};