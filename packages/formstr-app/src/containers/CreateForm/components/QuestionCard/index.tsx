import { Card } from "antd";
import { useRef, useState } from "react";
import { useEditable } from "use-editable";
import { IQuestion } from "../../typeDefs";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import CardHeader from "./CardHeader";
import Inputs from "./Inputs";
import { AnswerSettings } from "@formstr/sdk/dist/interfaces";
import StyledWrapper from "./index.style";

type QuestionCardProps = {
  question: IQuestion;
  onEdit: (question: IQuestion, tempId: string) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onEdit }) => {
  const questionRef = useRef(null);
  const [questionText, setQuestionText] = useState("Click to edit");
  const answerSettings = question.answerSettings;
  const { setQuestionIdInFocus } = useFormBuilderContext();

  const handleTextChange = (text: string) => {
    setQuestionText(text);
    onEdit({ ...question, question: questionText }, question.tempId);
  };

  useEditable(questionRef, handleTextChange);

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
        <CardHeader
          required={answerSettings.required}
          onRequired={handleRequiredChange}
        />

        <div ref={questionRef} className="question-text">
          <label>{questionText}</label>
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
