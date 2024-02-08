import { Card, Input } from "antd";
import { ChangeEvent } from "react";
import { IQuestion } from "../../typeDefs";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import CardHeader from "./CardHeader";
import Inputs from "./Inputs";
import { AnswerSettings } from "@formstr/sdk/dist/interfaces";
import StyledWrapper from "./index.style";
import { SmallDashOutlined } from "@ant-design/icons";
import QuestionTextStyle from "./question.style";

type QuestionCardProps = {
  question: IQuestion;
  onEdit: (question: IQuestion, tempId: string) => void;
  onReorderKey: (keyType: "UP" | "DOWN", tempId: string) => void;
  firstQuestion: boolean;
  lastQuestion: boolean;
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onEdit,
  onReorderKey,
  firstQuestion,
  lastQuestion,
}) => {
  const answerSettings = question.answerSettings;
  const { setQuestionIdInFocus } = useFormBuilderContext();

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    onEdit({ ...question, question: event.target.value }, question.tempId);
  };

  const handleRequiredChange = (required: boolean) => {
    onEdit(
      { ...question, answerSettings: { ...answerSettings, required } },
      question.tempId
    );
  };

  const onCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuestionIdInFocus(question.tempId);
  };

  const handleAnswerSettings = (answerSettings: AnswerSettings) => {
    onEdit({ ...question, answerSettings }, question.tempId);
  };

  return (
    <StyledWrapper>
      <Card type="inner" className="question-card" onClick={onCardClick}>
        <div className="drag-icon">
          <SmallDashOutlined />
        </div>
        <CardHeader
          required={answerSettings.required}
          onRequired={handleRequiredChange}
          question={question}
          onReorderKey={onReorderKey}
          firstQuestion={firstQuestion}
          lastQuestion={lastQuestion}
        />
        <div className="question-text">
          <QuestionTextStyle>
            <label>
              <Input.TextArea
                className="question-input"
                onChange={handleTextChange}
                defaultValue={question.question || "Click to edit"}
                placeholder="Enter a Question"
                autoSize
              />
            </label>
          </QuestionTextStyle>
        </div>

        <Inputs
          inputType={question.answerType}
          answerSettings={question.answerSettings}
          answerSettingsHandler={handleAnswerSettings}
        />
      </Card>
    </StyledWrapper>
  );
};

export default QuestionCard;
