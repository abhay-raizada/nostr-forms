import { makeTag } from "../../utils/utility";
import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";

const NewQuestionForm = (props) => {
  const { form, onAddQuestion } = props;
  const [showOptions, setShowOptions] = useState(false);

  function handleQuestionNameChange(event, form) {
    form.setFieldValue("question", event.target.value);
  }

  useEffect(() => {
    if (form.getFieldValue("inputType") === undefined) {
      form.setFieldValue("inputType", "string");
    }
  });

  function handleSaveQuestion() {
    let inputType = form.getFieldValue("inputType");
    let choices = form.getFieldValue("choices");
    let newQuestion = {
      question: form.getFieldValue("question"),
      answerType: inputType,
      tag: makeTag(6),
    };
    if (["singleChoice", "multipleChoice"].includes(inputType)) {
      newQuestion.choices = choices;
    }
    if(['number'].includes(inputType)) {
      newQuestion.numberConstraints = numberConstraints
    }
    onAddQuestion(newQuestion);
    form.setFieldValue("question", null);
    form.setFieldValue("inputType", "string");
    setShowOptions(false);
  }

  function handleInputType(value, _) {
    setShowOptions(["singleChoice", "multipleChoice"].includes(value));
    form.setFieldValue("inputType", value);
  }

  function handleChoices(options) {
    form.setFieldValue("choices", options);
  }

  function handleNumberConstraints(constraints) {
    form.setFieldValue("numberConstraints", constraints);
  }

  return (
    <QuestionCard
      handleSaveQuestion={handleSaveQuestion}
      handleEditQuestion={null}
      handleQuestionNameChange={(e) => handleQuestionNameChange(e, form)}
      handleInputType={handleInputType}
      showOptions={showOptions}
      handleChoices={handleChoices}
      handleNumberConstraints={handleNumberConstraints}
      form={form}
    />
  );
};

export default NewQuestionForm;
