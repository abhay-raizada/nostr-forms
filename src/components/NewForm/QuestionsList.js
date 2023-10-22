import { Card, Form } from "antd";
import { makeTag } from "../../utils/utility";
import { useState } from "react";
import QuestionCard from "./QuestionCard";
import React from "react";
import { isChoiceType, isNumberType } from "./util";
import QuestionActions from "./QuestionActions";

const initialQuesObj = {
  question: "",
  answerType: "",
};

const OPTION_TYPES = {
  CHOICE_OPTIONS: 1,
  NUMBER_OPTIONS: 2,
};

const QuestionList = (props) => {
  const { questions, onEditQuestion, onCloneQuestion, onDeleteQuestion } =
    props;
  const [showOptions, setShowOptions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [editQuestionForm] = Form.useForm();

  function handleQuestionNameChange(event, form) {
    form.setFieldValue("question", event.target.value);
  }

  function handleQuestionUpdate(index) {
    let inputType = editQuestionForm.getFieldValue("inputType");
    let choices = editQuestionForm.getFieldValue("choices");
    let numberConstraints = editQuestionForm.getFieldValue("numberConstraints");
    let newQuestion = {
      question: editQuestionForm.getFieldValue("question"),
      answerType: inputType,
      tag: makeTag(6),
    };
    if (isChoiceType(inputType)) {
      newQuestion.choices = choices;
    }
    if (isNumberType(inputType)) {
      newQuestion.numberConstraints = numberConstraints;
    }
    onEditQuestion(index, newQuestion);
    editQuestionForm.setFieldValue("question", null);
    editQuestionForm.setFieldValue("inputType", "string");
    setShowOptions(false);
    setCurrentQuestionIndex(-1);
  }

  function handleInputType(value, _) {
    const showOptions = isChoiceType(value)
      ? OPTION_TYPES.CHOICE_OPTIONS
      : isNumberType(value)
      ? OPTION_TYPES.NUMBER_OPTIONS
      : false;
    setShowOptions(showOptions);
    editQuestionForm.setFieldValue("inputType", value);
  }

  function handleChoices(options) {
    editQuestionForm.setFieldValue("choices", options);
  }

  function handleNumberConstraints(constraints) {
    editQuestionForm.setFieldValue("numberConstraints", constraints);
  }

  const handleQuestionEdit = (index) => {
    setCurrentQuestionIndex(index);
    editQuestionForm.setFieldValue("question", questions[index].question);
    editQuestionForm.setFieldValue("inputType", questions[index].answerType);
    if (isChoiceType(questions[index].answerType)) {
      setShowOptions(OPTION_TYPES.CHOICE_OPTIONS);
      editQuestionForm.setFieldValue("choices", questions[index].choices);
    }
    if (isNumberType(questions[index].answerType)) {
      setShowOptions(OPTION_TYPES.NUMBER_OPTIONS);
      editQuestionForm.setFieldValue(
        "numberConstraints",
        questions[index].numberConstraints
      );
    }
  };

  const handleQuestionClone = (index) => {
    setCurrentQuestionIndex(index);
    const cloneTag = makeTag(6);
    editQuestionForm.setFieldValue(
      "question",
      `${questions[index].question} clone`
    );
    editQuestionForm.setFieldValue("inputType", questions[index].answerType);
    editQuestionForm.setFieldValue("tag", cloneTag);
    const cloneObject = {
      question: questions[index].question,
      answerType: questions[index].answerType,
      tag: cloneTag,
    };
    // Update choices (if any)
    if (isChoiceType(questions[index].answerType)) {
      setShowOptions(OPTION_TYPES.CHOICE_OPTIONS);
      editQuestionForm.setFieldValue("choices", questions[index].choices);
      cloneObject["choices"] = questions[index].choices;
    }
    // Update number contraints (if any)
    if (isNumberType(questions[index].answerType)) {
      setShowOptions(OPTION_TYPES.NUMBER_OPTIONS);
      editQuestionForm.setFieldValue(
        "numberConstraints",
        questions[index].numberConstraints
      );
      cloneObject["numberConstraints"] = questions[index].numberConstraints;
    }
    onCloneQuestion(index, cloneObject);
    setCurrentQuestionIndex(index + 1);
  };

  return (
    <>
      {questions?.map((question, index) => {
        return (
          <React.Fragment key={question.tag}>
            {currentQuestionIndex !== index ? (
              // added question card
              <Card
                type="inner"
                title={question.question}
                extra={
                  <QuestionActions
                    handleQuestionEdit={handleQuestionEdit}
                    handleQuestionClone={handleQuestionClone}
                    handleQuestionDelete={onDeleteQuestion}
                    index={index}
                  />
                }
                key={question.tag}
              >
                <ul
                  style={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    alignContent: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <li>
                    <h3>Question:</h3> {question.question}
                  </li>
                </ul>
              </Card>
            ) : (
              // Edit question form
              <QuestionCard
                key={question.tag}
                handleEditQuestion={handleQuestionUpdate}
                handleQuestionNameChange={(e) =>
                  handleQuestionNameChange(e, editQuestionForm)
                }
                handleInputType={handleInputType}
                showOptions={showOptions}
                handleChoices={handleChoices}
                handleNumberConstraints={handleNumberConstraints}
                form={editQuestionForm}
                handleQuestionEdit={handleQuestionEdit}
                question={
                  currentQuestionIndex !== -1
                    ? questions[currentQuestionIndex]
                    : initialQuesObj
                }
                editIndex={currentQuestionIndex}
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default QuestionList;
