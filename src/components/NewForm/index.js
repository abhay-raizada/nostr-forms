import { useState } from "react";
import { createForm } from "../../utils/nostr";
import Constants from "../../constants";
import { Button, Card, Form, Input } from "antd";
import FormSubmitted from "./FormSubmitted";
import FormSettings from "./FormSettings";
import QuestionsController from "./QuestionsController";

function NewForm() {
  const [questions, setQuestions] = useState([]);
  const [formCredentials, setFormCredentials] = useState("");
  const [activeTab, setActiveTab] = useState(
    Constants.CreateFormTab.addQuestion
  );
  const [settingsForm] = Form.useForm();

  function handleNameChange(event) {
    settingsForm.setFieldValue("name", event.target.value);
  }

  function handleTabChange(key) {
    setActiveTab(key);
  }

  function handleAddQuestion(question) {
    let newQuestions = [...questions, question];
    setQuestions(newQuestions);
  }

  function submitSettingsForm() {
    settingsForm.onFinish = handleSaveForm;
    settingsForm.submit();
    settingsForm.onFinish();
  }

  function handleEditQuestion(index, editedQuestion) {
    const questionsList = [...questions];
    questionsList[index] = editedQuestion;
    setQuestions(questionsList);
  }

  function handleCloneQuestion(index, cloneQuestion) {
    const questionsList = [...questions];
    questionsList.splice(index + 1, 0, cloneQuestion);
    setQuestions(questionsList);
  }

  function handleDeleteQuestion(index) {
    let questionsList = [...questions];
    questionsList = questionsList.filter(
      (ques) => ques.tag !== questionsList[index].tag
    );
    setQuestions(questionsList);
  }

  async function handleSaveForm(values) {
    let showOnGlobal = settingsForm.getFieldValue("showOnGlobal") ?? true;
    let formspec = {
      name: settingsForm.getFieldValue("name"),
      description: settingsForm.getFieldValue("description"),
      settings: { selfSignForms: settingsForm.getFieldValue("selfSign") },
      fields: questions,
    };
    const [pk, sk] = await createForm(formspec, showOnGlobal);
    setFormCredentials({ publicKey: pk, privateKey: sk });
    setFormCredentials({ publicKey: 1, privateKey: 1 });
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
            <Card
              style={{ maxWidth: "100%", alignContent: "left" }}
              tabList={Constants.tabList}
              activeTabKey={activeTab}
              onTabChange={handleTabChange}
              title={settingsForm.getFieldValue("name") || "New Form"}
              extra={
                <Button
                  type="primary"
                  disabled={questions.length < 1}
                  onClick={submitSettingsForm}
                >
                  Submit Form
                </Button>
              }
            >
              {activeTab === Constants.CreateFormTab.settings && (
                <>
                  <FormSettings
                    onFormFinish={handleSaveForm}
                    form={settingsForm}
                    onFinishFailed={onFinishFailed}
                  />
                </>
              )}

              {activeTab === Constants.CreateFormTab.addQuestion && (
                <>
                  <Card style={{ margin: "10px" }}>
                    <div
                      style={{
                        justifyContent: "left",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        margin: "10px",
                      }}
                    >
                      <Form form={settingsForm}>
                        {" "}
                        <Form.Item
                          name="name"
                          label="Name of the form"
                          rules={[{ required: true }]}
                        >
                          <Input onChange={handleNameChange} />
                        </Form.Item>
                      </Form>
                      <Button
                        type="link"
                        onClick={() => {
                          handleTabChange(Constants.CreateFormTab.settings);
                        }}
                      >
                        Additional Settings
                      </Button>
                    </div>
                  </Card>
                  <QuestionsController
                    actionHandlers={{
                      onEditQuestion: handleEditQuestion,
                      onAddQuestion: handleAddQuestion,
                      onCloneQuestion: handleCloneQuestion,
                      onDeleteQuestion: handleDeleteQuestion,
                    }}
                    questions={questions}
                  />

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      margin: "10px",
                    }}
                  >
                    {questions.length >= 1 && (
                      <Button type="primary" onClick={submitSettingsForm}>
                        Submit Form
                      </Button>
                    )}
                  </div>
                </>
              )}
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
