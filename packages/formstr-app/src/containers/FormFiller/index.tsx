import { V1FormSpec } from "@formstr/sdk/dist/interfaces";
import FillerStyle from "./formFiller.style";
import FormTitle from "../CreateForm/components/FormTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFormTemplate, sendResponses, sendNotification } from "@formstr/sdk";
import { Form, Typography } from "antd";
import { QuestionNode } from "./QuestionNode/QuestionNode";
import { ThankYouScreen } from "./ThankYouScreen";
import { getValidationRules } from "./validations";
import { SubmitButton } from "./SubmitButton/submit";

const { Text } = Typography;

export const FormFiller = () => {
  const { formId } = useParams();
  const [formTemplate, setFormTemplate] = useState<V1FormSpec | null>(null);
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

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

  const saveResponse = async (anonymous: boolean = true) => {
    let formResponses = form.getFieldsValue(true);
    const response = Object.keys(formResponses).map((key: string) => {
      let [answer, message] = formResponses[key];
      return {
        questionId: key,
        answer,
        message,
      };
    });
    await sendResponses(formId, response, anonymous);
    if (formTemplate) sendNotification(formTemplate, response);
    setFormSubmitted(true);
  };

  const { name, settings, fields } = formTemplate || {};

  return (
    <FillerStyle>
      <div className="filler-container">
        <div className="form-filler">
          <FormTitle
            className="form-title"
            edit={false}
            imageUrl={settings?.titleImageUrl}
            formTitle={name}
          />
          <div className="form-description">
            <Text>{settings?.description}</Text>
          </div>

          <Form form={form} onFinish={() => {}}>
            <div>
              {fields?.map((field) => {
                let rules = [
                  {
                    required: field.answerSettings.required,
                    message: "This is a required question",
                  },
                  ...getValidationRules(field.answerType, field.answerSettings),
                ];
                return (
                  <Form.Item
                    key={field.questionId}
                    rules={rules}
                    name={field.questionId}
                  >
                    <QuestionNode
                      required={field.answerSettings.required || false}
                      field={field}
                      inputHandler={handleInput}
                    />
                  </Form.Item>
                );
              })}
              <SubmitButton
                selfSign={formTemplate?.settings?.disallowAnonymous}
                edit={false}
                onSubmit={saveResponse}
                form={form}
              />
            </div>
          </Form>
        </div>
        <ThankYouScreen
          isOpen={formSubmitted}
          onClose={() => {
            navigate("/");
          }}
        ></ThankYouScreen>
      </div>
    </FillerStyle>
  );
};
