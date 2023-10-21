import { Button, Card, Form, Input, Select } from "antd";
import { makeTag } from "../../utils/utility";
import Choices from "./Choices";
import {NumberConstraints} from "./NumberConstraints";
import { useEffect, useState } from "react";

const OPTION_TYPES = {
  CHOICE_OPTIONS: 1,
  NUMBER_OPTIONS: 2
}

const QuestionForm = (props) => {
  const { questions, form, onAddQuestion } = props;
  const [newQuestion, setNewQuestion] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { Option } = Select;

  function handleCurrentQuestion(event) {
    form.setFieldValue("question", event.target.value);
  }

  useEffect(() => {
    if (form.getFieldValue("inputType") === undefined) {
      form.setFieldValue("inputType", "string");
    }
  });

  function addQuestion() {
    setNewQuestion(true);
  }

  function handleSaveQuestion() {
    let inputType = form.getFieldValue("inputType");
    let choices = form.getFieldValue("choices");
    let numberConstraints = form.getFieldValue("numberConstraints");
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
    setNewQuestion(false);
    form.setFieldValue("inputType", "string");
    setShowOptions(false);
  }

  function handleInputType(value, _) {
    const showOptions =
        ["singleChoice", "multipleChoice"].includes(value) ?
            OPTION_TYPES.CHOICE_OPTIONS : ["number"].includes(value) ?
                OPTION_TYPES.NUMBER_OPTIONS : false
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
    <>
      {questions?.map((question) => {
        return (
          <Card type="inner" title={question.question}>
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
        );
      })}
      {newQuestion && (
        <Card type="inner" style={{ maxWidth: "100%", margin: "10px" }}>
          <Form form={form} onFinish={handleSaveQuestion}>
            <Form.Item
              name="question"
              label="Question"
              rules={[{ required: true }]}
            >
              <Input type="text" onChange={handleCurrentQuestion} />
            </Form.Item>
            <Form.Item name="inputType" label="Input type">
              <Select defaultValue="string" onSelect={handleInputType}>
                <Option value="string">Short Answer</Option>
                <Option value="text">Paragraph</Option>
                <Option value="singleChoice">
                  Choice{"("}Radio Button{")"}
                </Option>
                <Option value="number">
                  Number
                </Option>
                <Option value="multipleChoice" disabled>
                  Choice{"("}Checkbox{")"}
                </Option>
                <Option value="date" disabled>
                  Date
                </Option>
              </Select>
            </Form.Item>
            {showOptions === OPTION_TYPES.CHOICE_OPTIONS && (
              <Form.Item name="choices">
                <Choices onChoice={handleChoices} />
              </Form.Item>
            )}
            {showOptions === OPTION_TYPES.NUMBER_OPTIONS && (
                <Form.Item name="numberConstraints">
                  <NumberConstraints
                      onConstraintsChange={handleNumberConstraints}
                  />
                </Form.Item>
            )}
            <Button htmlType="submit">Add Question</Button>
          </Form>
        </Card>
      )}
      <Card title="Add a question">
        {" "}
        <Button
          type="primary"
          size="large"
          disabled={newQuestion}
          onClick={addQuestion}
          style={{ margin: "10px" }}
        >
          Add +
        </Button>
      </Card>
    </>
  );
};

export default QuestionForm;
