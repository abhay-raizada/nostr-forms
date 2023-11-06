import { makeTag } from "../../utils/utility";
import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { isChoiceType, isNumberType } from "./util";

const OPTION_TYPES = {
  CHOICE_OPTIONS: 1,
  NUMBER_OPTIONS: 2,
};

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
    let numberConstraints = form.getFieldValue("numberConstraints");
    let newQuestion = {
      question: form.getFieldValue("question"),
      answerType: inputType,
      tag: makeTag(6),
    };
    if (isChoiceType(inputType)) {
      newQuestion.choices = choices;
    }
    if (isNumberType(inputType)) {
      newQuestion.numberConstraints = numberConstraints;
    }
    onAddQuestion(newQuestion);
    form.setFieldValue("question", null);
    form.setFieldValue("inputType", "string");
    setShowOptions(false);
  }

  function handleInputType(value, _) {
    const showOptions = isChoiceType(value)
      ? OPTION_TYPES.CHOICE_OPTIONS
      : isNumberType(value)
      ? OPTION_TYPES.NUMBER_OPTIONS
      : false;
    setShowOptions(showOptions);
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
