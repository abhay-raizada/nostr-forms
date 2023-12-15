import { Card } from "antd";
import { useRef, useState } from "react";
import { useEditable } from "use-editable";
import { IQuestion } from "../QuestionsList";
import CardHeader from "./CardHeader";
import Inputs from "./Inputs";

type QuestionCardProps = {
  question: IQuestion;
  onEdit: (question: IQuestion, tempId: string) => void;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, onEdit }) => {
  const questionRef = useRef(null);
  const [questionText, setQuestionText] = useState("Click to edit");

  const handleChange = (text: string) => {
    setQuestionText(text);
    onEdit({ ...question, question: questionText }, question.tempId);
  };

  useEditable(questionRef, handleChange);

  return (
    <Card
      type="inner"
      style={{
        maxWidth: "100%",
        margin: "10px",
        textAlign: "left",
      }}
    >
      <CardHeader />

      <div style={{ marginBottom: 10 }}>
        <label ref={questionRef}>{questionText}</label>
      </div>

      <Inputs
        inputType={question.answerType}
        inputSettingsHandler={() => {
          return;
        }}
      />
    </Card>
  );
};

export default QuestionCard;
