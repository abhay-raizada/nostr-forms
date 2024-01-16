import {
  AnswerTypes,
  FormSpec,
  V1Choice,
  V1FormSpec,
} from "@formstr/sdk/dist/interfaces";
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
import { makeTag } from "../../utils/utility";

const { Text } = Typography;

interface FormFillerProps {
  formSpec?: FormSpec;
}

export const FormFiller: React.FC<FormFillerProps> = ({ formSpec }) => {
  const { formId } = useParams();
  const [formTemplate, setFormTemplate] = useState<V1FormSpec | null>(null);
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();

  const isPreview = !!formSpec;

  console.log("im inside the fillerrrrr");

  const convertFromSpecToTemplate = (formSpec: FormSpec): V1FormSpec => {
    let fields = formSpec.fields?.map((field) => {
      let answerSettings = field.answerSettings;
      let answerType = field.answerType;
      let newChoices: V1Choice[] | undefined;
      if (
        answerType ===
        (AnswerTypes.checkboxes ||
          AnswerTypes.radioButton ||
          AnswerTypes.dropdown)
      ) {
        newChoices = field.answerSettings.choices?.map((choice) => {
          return {
            label: choice.label,
            isOther: choice.isOther,
            choiceId: makeTag(6),
          };
        });
      }
      return {
        questionId: makeTag(6),
        question: field.question,
        answerType,
        answerSettings: { ...answerSettings, choices: newChoices },
      };
    });
    return {
      schemaVersion: "v1",
      name: formSpec.name,
      settings: formSpec.settings,
      fields,
    };
  };

  useEffect(() => {
    async function getForm() {
      if (!formTemplate) {
        if (!formId && !formSpec) {
          throw Error("Form Id not provided");
        }
        let form;
        if (formId) form = await getFormTemplate(formId);
        if (formSpec) form = convertFromSpecToTemplate(formSpec);
        if (!form) return;
        setFormTemplate(form);
      }
    }
    getForm();
  }, [formTemplate, formId]);

  if (!formId && !formSpec) {
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
    if (formId) await sendResponses(formId, response, anonymous);
    if (formTemplate && !isPreview) sendNotification(formTemplate, response);
    setFormSubmitted(true);
  };

  let name, settings, fields;
  if (formTemplate) {
    name = formTemplate.name;
    settings = formTemplate.settings;
    fields = formTemplate.fields;
  }

  console.log("Im here form template is", formTemplate);

  return (
    <FillerStyle $isPreview={isPreview}>
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
                disabled={isPreview}
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
