import { V1FormSpec } from "@formstr/sdk/dist/interfaces";
import StyleWrapperChild from "../CreateForm/components/QuestionsList/style";
import StyleWrapper from "../CreateForm/index.style";
import FormTitle from "../CreateForm/components/FormTitle";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFormTemplate } from "@formstr/sdk";
import { Form, Typography } from "antd";
import { QuestionNode } from "./QuestionNode/QuestionNode";

const { Text } = Typography;

export const FormFiller = () => {
  const { formId } = useParams();
  const [formTemplate, setFormTemplate] = useState<V1FormSpec | null>(null);
  const [form] = Form.useForm();

  const handleInput = (
    questionId: string,
    answer: string,
    message?: string
  ) => {
    form.setFieldValue(questionId, [answer, message]);
  };

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
  });
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

          <Form form={form} requiredMark={true}>
            {fields?.map((field) => {
              console.log("Field issssss", field);
              return (
                <Form.Item
                  rules={[{ required: field.answerSettings.required }]}
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
          </Form>
        </div>
      </StyleWrapperChild>
    </StyleWrapper>
  );
};
