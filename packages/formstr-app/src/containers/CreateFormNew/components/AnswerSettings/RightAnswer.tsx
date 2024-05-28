import { AnswerSettings, AnswerTypes } from "@formstr/sdk/dist/interfaces";
import { InputFiller } from "../../../../old/containers/FormFiller/QuestionNode/InputFiller";
import { Tooltip, Typography } from "antd";

const { Text } = Typography;

interface RightAnswerProps {
  answerType: AnswerTypes;
  answerSettings: AnswerSettings;
  onChange: (answer: string) => void;
}

export const RightAnswer: React.FC<RightAnswerProps> = ({
  answerType,
  answerSettings,
  onChange,
}) => {
  function convertV1toV2(answerSettings: AnswerSettings) {
    const newAnswerSettings = {
      ...answerSettings,
      choices: answerSettings?.choices?.map((choice) => {
        return {
          ...choice,
          choiceId: choice.choiceId!,
        };
      }),
    };
    return newAnswerSettings;
  }

  return (
    <Tooltip title="For quiz-like forms where you want users to choose the right answer">
      <div className="right-answer">
        <Text className="property-name"> Right answer</Text>
        <InputFiller
          defaultValue={answerSettings?.validationRules?.match?.answer}
          answerType={answerType}
          answerSettings={convertV1toV2(answerSettings)}
          onChange={onChange}
        />
      </div>
    </Tooltip>
  );
};
