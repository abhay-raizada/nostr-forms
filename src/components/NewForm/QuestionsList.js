import { Card, Form } from "antd";
import { makeTag } from "../../utils/utility";
import { useState } from "react";
import { EditFilled } from "@ant-design/icons";
import QuestionCard from "./QuestionCard";

const initialQuesObj = {
  question: "",
  answerType: "",
};

const OPTION_TYPES = {
  CHOICE_OPTIONS: 1,
  NUMBER_OPTIONS: 2
}

const QuestionList = (props) => {
  const { questions, onEditQuestion } = props;
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
    if (["singleChoice", "multipleChoice"].includes(inputType)) {
      newQuestion.choices = choices;
    }
    if (["number"].includes(inputType)) {
      newQuestion.numberConstraints = numberConstraints;
    }
    onEditQuestion(index, newQuestion);
    editQuestionForm.setFieldValue("question", null);
    editQuestionForm.setFieldValue("inputType", "string");
    setShowOptions(false);
    setCurrentQuestionIndex(-1);
  }

  function handleInputType(value, _) {
    const showOptions = ["singleChoice", "multipleChoice"].includes(value)
      ? OPTION_TYPES.CHOICE_OPTIONS
      : ["number"].includes(value)
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
    if (
      ["singleChoice", "multipleChoice"].includes(questions[index].answerType)
    ) {
      setShowOptions(OPTION_TYPES.CHOICE_OPTIONS);

      editQuestionForm.setFieldValue("choices", questions[index].choices);
    }
    if (["number"].includes(questions[index].answerType)) {
      setShowOptions(OPTION_TYPES.NUMBER_OPTIONS);
      editQuestionForm.setFieldValue(
        "numberConstraints",
        questions[index].numberConstraints
      );
    }
  };

  const questionAction = (index) => {
    return (
      <div title="edit">
        <EditFilled onClick={() => handleQuestionEdit(index)} />
      </div>
    );
  };

  return (
    <>
      {questions?.map((question, index) => {
        return (
          <>
            {currentQuestionIndex !== index ? (
              <Card
                type="inner"
                title={question.question}
                extra={questionAction(index)}
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
              <QuestionCard
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
          </>
        );
      })}
    </>
  );
};

export default QuestionList;
