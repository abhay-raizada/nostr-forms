import { useState } from "react";
import { createForm } from "../../utils/nostr";
import Choices from "./Choices";
import { makeTag } from "../../utils/utility";

import { Button, Card, Form, Input, Select, Typography } from "antd";
import FormSubmitted from "./FormSubmitted";

function NewForm() {
  const [newQuestion, setNewQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [formCredentials, setFormCredentials] = useState("");
  const [publicForm, setPublicForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [inputType, setInputType] = useState("string");
  const [choices, setChoices] = useState([]);
  const { Option } = Select;
  const { Text, Paragraph, Title } = Typography;

  function addQuestion() {
    setNewQuestion(true);
  }

  function handleCurrentQuestion(event) {
    setCurrentQuestion(event.target.value);
  }

  function handleNameChange(event) {
    setFormName(event.target.value);
  }

  function handlePublicForm(event) {
    setPublicForm(event.target.checked);
  }

  function handleDescriptionChange(event) {
    setFormDescription(event.target.value);
  }

  function handleInputType(value, _) {
    setInputType(value);
  }

  function handleChoices(options) {
    setChoices(options);
  }

  function handleSaveQuestion() {
    let newQuestion = {
      question: currentQuestion,
      answerType: inputType,
      tag: makeTag(6),
    };
    if (["singleChoice", "multipleChoice"].includes(inputType)) {
      newQuestion.choices = choices;
    }
    let newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    setCurrentQuestion("");
    setNewQuestion(false);
  }
  async function handleSaveForm() {
    let formspec = {
      name: formName,
      description: formDescription,
      fields: questions,
    };
    const [pk, sk] = await createForm(formspec, publicForm);
    setFormCredentials({ publicKey: pk, privateKey: sk });
  }
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          maxWidth: "100%",
        }}
      >
        {!formCredentials && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "left",
              justifyContent: "left",
              maxWidth: "100%",
              minWidth: "70%",
            }}
          >
            <Card style={{ maxWidth: "100%", alignContent: "left" }}>
              <Form>
                <Title level={2}>New Form</Title>
                <Form.Item label="Name of the form">
                  {" "}
                  <Input onChange={handleNameChange} />{" "}
                </Form.Item>
                <Form.Item label="Enter form description">
                  {" "}
                  <Input onChange={handleDescriptionChange} />{" "}
                </Form.Item>
                <Form.Item label="Make responses public?">
                  {" "}
                  <Input type="checkbox" onChange={handlePublicForm} />{" "}
                </Form.Item>
              </Form>
              {questions.map((question) => {
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
                      <li>
                        <h3>Input Type:</h3> {question.answerType}
                      </li>
                    </ul>
                  </Card>
                );
              })}
              {newQuestion && (
                <Card type="inner" style={{ maxWidth: "100%", margin: "10px" }}>
                  <Form>
                    <Form.Item label="Question">
                      <Input type="text" onChange={handleCurrentQuestion} />
                    </Form.Item>
                    <Form.Item label="Input type">
                      <Select defaultValue="string" onSelect={handleInputType}>
                        <Option value="string">Short Answer</Option>
                        <Option value="text" disabled>
                          Paragraph
                        </Option>
                        <Option value="singleChoice">
                          Choice{"("}Radio Button{")"}
                        </Option>
                        <Option value="multipleChoice" disabled>
                          Choice{"("}Checkbox{")"}
                        </Option>
                        <Option value="number" disabled>
                          Number
                        </Option>
                        <Option value="date" disabled>
                          Date
                        </Option>
                      </Select>
                    </Form.Item>
                    {["singleChoice", "multipleChoice"].includes(inputType) && (
                      <Form.Item>
                        <Choices onChoice={handleChoices} />
                      </Form.Item>
                    )}
                    <Button onClick={handleSaveQuestion}>Add Question</Button>
                  </Form>
                </Card>
              )}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "10px",
                }}
              >
                <Button
                  type="primary"
                  size="large"
                  disabled={newQuestion}
                  onClick={addQuestion}
                  style={{ margin: "10px" }}
                >
                  +
                </Button>
                {questions.length >= 1 && (
                  <Button onClick={handleSaveForm}>Save Form</Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
      {formCredentials && (
        <FormSubmitted formCredentials={formCredentials} formName={formName} />
      )}
    </>
  );
}

export default NewForm;
