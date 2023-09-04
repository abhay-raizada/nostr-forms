import { useState } from "react";
import { createForm } from "../../utils/nostr";
import { makeTag } from "../../utils/utility";

import { Button, Card, Form, Input, Select, Typography } from "antd";
import Paragraph from "antd/es/skeleton/Paragraph";
import Title from "antd/es/skeleton/Title";

function NewForm() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questions, setQuestions] = useState([]);
  const [formCredentials, setFormCredentials] = useState("");
  const [publicForm, setPublicForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const { Option } = Select;
  const { Text, Paragraph, Title } = Typography;

  function toggleModal() {
    setIsOpenForm(!isOpenForm);
  }

  function constructFormUrl() {
    let hostname = window.location.host;
    if (hostname.includes("abhay-raizada")) {
      hostname += "/nostr-forms";
    }

    return "http://" + hostname + "/#/forms/" + formCredentials.publicKey;
  }

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

  function handleSaveQuestion() {
    let newQuestions = [
      ...questions,
      { question: currentQuestion, answerType: "string", tag: makeTag(6) },
    ];
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
        }}
      >
        {!formCredentials && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
              justifyContent: "center",
              maxWidth: "80%",
            }}
          >
            <Card>
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
                  <Card
                    type="inner"
                    title={question.question}
                    style={{ margin: "10px" }}
                  >
                    <ul>
                      <li>Question: {question.question}</li>
                      <li>Input Type: {question.answerType}</li>
                      <li>Question ID: {question.tag}</li>
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
                      <Select defaultValue="Text">
                        <Option value="Text">Text</Option>
                        <Option value="Single Choice" disabled>
                          Single Choice{"("}Radio Button{")"}
                        </Option>
                        <Option value="Multiple choice" disabled>
                          Multiple Choice{"("}Checkbox{")"}
                        </Option>
                        <Option value="Number" disabled>
                          Number
                        </Option>
                        <Option value="Date" disabled>
                          Date
                        </Option>
                      </Select>
                    </Form.Item>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
          }}
        >
          <Text> Your form has been published! </Text>
          <div>
            <Text>
              {" "}
              The Form Can be found here:{" "}
              <Paragraph copyable>
                {" "}
                <a href={constructFormUrl()}>{constructFormUrl()}</a>{" "}
              </Paragraph>{" "}
            </Text>
          </div>
          <div>
            <Text>
              Private Key (needed to acces responses){" "}
              <Paragraph copyable> {formCredentials.privateKey} </Paragraph>{" "}
            </Text>
          </div>
        </div>
      )}
    </>
  );
}

export default NewForm;
