import { useState } from "react";
import { Button, Card, Form } from "antd";
import NewQuestionForm from "./NewQuestionForm";
import QuestionsList from "./QuestionsList";

const QuestionsController = (props) => {
  const { questions, actionHandlers } = props;
  const { onAddQuestion, ...rest } = actionHandlers;
  const [questionsForm] = Form.useForm();

  const [isNewQuestion, setIsNewQuestion] = useState(false);

  function addQuestion() {
    setIsNewQuestion(true);
  }

  function handleAddQuestion(question) {
    setIsNewQuestion(false);
    onAddQuestion(question);
  }

  return (
    <>
      <QuestionsList {...rest} questions={questions} />
      {isNewQuestion && (
        <NewQuestionForm
          form={questionsForm}
          onAddQuestion={handleAddQuestion}
        />
      )}
      <Card title="Add a question" style={{ margin: "10px" }}>
        <Button
          type="primary"
          size="large"
          disabled={isNewQuestion}
          onClick={addQuestion}
        >
          Add +
        </Button>
      </Card>
    </>
  );
};

export default QuestionsController;
