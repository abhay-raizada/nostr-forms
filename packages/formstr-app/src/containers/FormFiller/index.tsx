import { V1FormSpec } from "@formstr/sdk/dist/interfaces";
import StyleWrapperChild from "../CreateForm/components/QuestionsList/style";
import StyleWrapper from "../CreateForm/index.style";
import FormTitle from "../CreateForm/components/FormTitle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFormTemplate, sendResponses } from "@formstr/sdk";
import { Button, Form, Typography } from "antd";
import { QuestionNode } from "./QuestionNode/QuestionNode";

const { Text } = Typography;

export const FormFiller = () => {
  const { formId } = useParams();
  const [formTemplate, setFormTemplate] = useState<V1FormSpec | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    async function getForm() {
      if (!formTemplate) {
        if (!formId) {
          throw Error("Form Id not provided");
        }
        let form = await getFormTemplate(formId);
        setFormTemplate(form);
      }
    }
    getForm();
  }, [formTemplate, formId]);

  if (!formId) {
    return;
  }

  const handleInput = (
    questionId: string,
    answer: string,
    message?: string
  ) => {
    if (!answer || answer === "") {
      form.setFieldValue(questionId, null);
      return;
    }
    form.setFieldValue(questionId, [answer, message]);
  };

  const saveResponse = async () => {
    let formResponses = form.getFieldsValue(true);
    const response = Object.keys(formResponses).map((key: string) => {
      let [answer, message] = formResponses[key];
      return {
        questionId: key,
        answer,
        message,
      };
    });
    console.log("response is", response);
    sendResponses(formId, response, true);
  };

  const { name, settings, fields } = formTemplate || {};

  console.log("Form template is", formTemplate);

  return (
    <StyleWrapper $isRightSettingsOpen={false}>
      <StyleWrapperChild style={{ width: "60%", margin: "0 auto 0 auto" }}>
        <div>
          <FormTitle
            className="form-title"
            edit={false}
            imageUrl={settings?.titleImageUrl}
            formTitle={name}
          />
          <div className="form-description">
            <Text>{settings?.description}</Text>
          </div>

          <Form form={form} requiredMark={true} onFinish={saveResponse}>
            <div>
              {fields?.map((field) => {
                return (
                  <Form.Item
                    rules={[
                      {
                        required: field.answerSettings.required,
                        message: "This is a required question",
                      },
                    ]}
                    name={field.questionId}
                  >
                    <QuestionNode
                      key={field.questionId}
                      required={field.answerSettings.required || false}
                      field={field}
                      inputHandler={handleInput}
                    />
                  </Form.Item>
                );
              })}
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </StyleWrapperChild>
    </StyleWrapper>
  );
};
