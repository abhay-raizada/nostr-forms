import { useState } from "react";
import { Button, Card, Form } from "antd";
import NewQuestionForm from "./NewQuestionForm";
import QuestionsList from "./QuestionsList";

const QuestionsPage = (props) => {
  const { questions, onAddQuestion, onEditQuestion } = props;
  const [questionsForm] = Form.useForm();

  const [isNewQuestion, setIsNewQuestion] = useState(false);

  function addQuestion() {
    setIsNewQuestion(true);
  }

  function handleEditQuestion(index, editedQuestion) {
    onEditQuestion(index, editedQuestion);
  }

  function handleAddQuestion(question) {
    setIsNewQuestion(false);
    onAddQuestion(question);
  }

  return (
    <>
      <QuestionsList
        onEditQuestion={handleEditQuestion}
        questions={questions}
      />
      {isNewQuestion && (
        <NewQuestionForm
          form={questionsForm}
          onAddQuestion={handleAddQuestion}
        />
      )}
      <Card title="Add a question">
        <Button
          type="primary"
          size="large"
          disabled={isNewQuestion}
          onClick={addQuestion}
          style={{ margin: "10px" }}
        >
          Add +
        </Button>
      </Card>
    </>
  );
};

export default QuestionsPage;
