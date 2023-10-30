import { useEffect, useState } from "react";
import { createForm } from "../../utils/nostr";
import Constants from "../../constants";
import { Button, Card, Form, Input, notification } from "antd";
import FormSubmitted from "./FormSubmitted";
import FormSettings from "./FormSettings";
import QuestionsController from "./QuestionsController";
import { makeTag } from "../../utils/utility";
import { useLocation } from "react-router";

function NewForm() {
  const [questions, setQuestions] = useState([]);
  const [formTempId, setFormTempId] = useState(null);
  const [formCredentials, setFormCredentials] = useState("");
  const [activeTab, setActiveTab] = useState(
    Constants.CreateFormTab.addQuestion
  );
  const [settingsForm] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const { state } = useLocation();

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
    settingsForm.submit();
    handleSaveForm();
  }

  function fillFormFields(formSpec, tempId) {
    settingsForm.setFieldValue("name", formSpec.name);
    settingsForm.setFieldValue("description", formSpec.description);
    settingsForm.setFieldValue("selfSign", formSpec.settings?.selfSign);
    setQuestions(formSpec.fields);
    setFormTempId(tempId);
  }

  useEffect(() => {
    console.log("state is", state)
    let name = settingsForm.getFieldValue("name");
    if (state && !name) {
      fillFormFields(state.formSpec, state.tempId);
    }
  });

  const getFromSpec = () => {
    return {
      name: settingsForm.getFieldValue("name"),
      description: settingsForm.getFieldValue("description"),
      settings: { selfSignForms: settingsForm.getFieldValue("selfSign") },
      fields: questions,
    };
  };

  function createOrUpdateDrafts(draftObject, drafts) {
    let draftIndex = drafts
      .map((draft) => draft.tempId)
      .indexOf(draftObject.tempId);
    if (draftIndex === -1) {
      drafts.push(draftObject);
    } else {
      drafts[draftIndex] = draftObject;
    }
    localStorage.setItem(`formstr:drafts`, JSON.stringify(drafts));
    api.info({
      message: `Draft ${draftIndex === -1 ? "Saved" : "Updated"} Succesfully`,
    });
  }

  async function saveDraft() {
    let tag = makeTag(6);
    if (!formTempId) {
      setFormTempId(tag);
    } else {
      tag = formTempId;
    }
    try {
      await settingsForm.validateFields();
    } catch (e) {
      console.log("Form Validations Failed", e);
    }
    const isFormValid = () =>
      settingsForm.getFieldsError().some((item) => item.errors.length === 0);

    if (!isFormValid()) {
      api.warning({ message: "Form validations failed, unable to save draft" });
      return;
    }

    const formSpec = getFromSpec();
    const draftObject = { formSpec, tempId: tag };
    const draftArr = JSON.parse(localStorage.getItem("formstr:drafts")) || [];
    createOrUpdateDrafts(draftObject, draftArr);
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
    let showOnGlobal = settingsForm.getFieldValue("showOnGlobal");
    let formspec = getFromSpec();
    const [pk, sk] = await createForm(formspec, showOnGlobal);
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
        {contextHolder}
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
                  onClick={saveDraft}
                  title="This will be saved locally"
                >
                  {formTempId ? "Update Draft" : "Save Draft"}
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
