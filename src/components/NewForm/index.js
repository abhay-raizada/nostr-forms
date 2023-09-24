import { useState } from "react";
import { createForm } from "../../utils/nostr";
import Choices from "./Choices";
import { makeTag } from "../../utils/utility";

import { Button, Card, Form, Input, Select, Typography } from "antd";
import FormSubmitted from "./FormSubmitted";

function NewForm() {
  const [newQuestion, setNewQuestion] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [formCredentials, setFormCredentials] = useState("");
  const { Option } = Select;
  const { Title } = Typography;
  const [settingsForm] = Form.useForm();
  const [questionsForm] = Form.useForm();

  function addQuestion() {
    setNewQuestion(true);
  }

  function handleCurrentQuestion(event) {
    questionsForm.setFieldValue("question", event.target.value);
  }

  function handleSelfSign(event) {
    settingsForm.setFieldValue("selfSign", event.target.checked);
  }

  function handleNameChange(event) {
    settingsForm.setFieldValue("name", event.target.value);
  }

  function handlePublicForm(event) {
    settingsForm.setFieldValue("public?", event.target.checked);
  }

  function handleDescriptionChange(event) {
    settingsForm.setFieldValue("description", event.target.value);
  }

  function handleInputType(value, _) {
    console.log("inputType", value, questionsForm.getFieldValue("inputType"));
    if (["singleChoice", "multipleChoice"].includes(value)) {
      setShowOptions(true);
    } else {
      setShowOptions(false);
    }
    questionsForm.setFieldValue("inputType", value);
  }

  function handleChoices(options) {
    questionsForm.setFieldValue("choices", options);
  }

  function submitSettingsForm() {
    settingsForm.submit();
  }

  function handleSaveQuestion() {
    let inputType = questionsForm.getFieldValue("inputType");
    let choices = questionsForm.getFieldValue("choices");
    let newQuestion = {
      question: questionsForm.getFieldValue("question"),
      answerType: inputType,
      tag: makeTag(6),
    };
    if (["singleChoice", "multipleChoice"].includes(inputType)) {
      newQuestion.choices = choices;
    }
    let newQuestions = [...questions, newQuestion];
    setQuestions(newQuestions);
    questionsForm.setFieldValue("question", undefined);
    setNewQuestion(false);
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  async function handleSaveForm(values) {
    let formspec = {
      name: settingsForm.getFieldValue("name"),
      description: settingsForm.getFieldValue("description"),
      settings: { selfSignForms: settingsForm.getFieldValue("selfSign") },
      fields: questions,
    };
    let publicForm = settingsForm.getFieldValue("public?");
    const [pk, sk] = await createForm(formspec, publicForm);
    setFormCredentials({ publicKey: pk, privateKey: sk });
  }

  function onFinishFailed(error) {
    console.log("Task failed successfully :D", error);
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
              <Form
                {...formItemLayout}
                labelWrap
                onFinish={handleSaveForm}
                form={settingsForm}
                onFinishFailed={onFinishFailed}
              >
                <Title level={2}>New Form</Title>
                <Form.Item
                  name="name"
                  label="Name of the form"
                  rules={[{ required: true }]}
                >
                  {" "}
                  <Input onChange={handleNameChange} />{" "}
                </Form.Item>
                <Form.Item name="description" label="Enter form description">
                  {" "}
                  <Input onChange={handleDescriptionChange} />{" "}
                </Form.Item>
                <Form.Item name="public?" label="Make responses public?">
                  {" "}
                  <Input type="checkbox" onChange={handlePublicForm} />{" "}
                </Form.Item>
                <Form.Item
                  name="selfSign"
                  label="Non-anonymous form filling: Ask users to self sign their submissions"
                >
                  {" "}
                  <Input type="checkbox" onChange={handleSelfSign} />{" "}
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
                    </ul>
                  </Card>
                );
              })}
              {newQuestion && (
                <Card type="inner" style={{ maxWidth: "100%", margin: "10px" }}>
                  <Form form={questionsForm} onFinish={handleSaveQuestion}>
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
                    {showOptions && (
                      <Form.Item name="choices">
                        <Choices onChoice={handleChoices} />
                      </Form.Item>
                    )}
                    <Button htmlType="submit">Add Question</Button>
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
                  <Button onClick={submitSettingsForm}>Finish</Button>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
      {formCredentials && (
        <FormSubmitted
          formCredentials={formCredentials}
          formName={settingsForm.getFieldValue("name")}
        />
      )}
    </>
  );
}

export default NewForm;
