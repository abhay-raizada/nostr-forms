import { Field, Tag, Option, Response } from "@formstr/sdk/dist/formstr/nip101";
import { sendResponses } from "@formstr/sdk/dist/formstr/nip101/sendResponses";
import FillerStyle from "./formFiller.style";
import FormTitle from "../CreateForm/components/FormTitle";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Form, Typography } from "antd";
import { ThankYouScreen } from "./ThankYouScreen";
import { SubmitButton } from "./SubmitButton/submit";
import { isMobile } from "../../utils/utility";
import { ReactComponent as CreatedUsingFormstr } from "../../Images/created-using-formstr.svg";
import { ROUTES as GLOBAL_ROUTES } from "../../constants/routes";
import { ROUTES } from "../MyForms/configs/routes";
import Markdown from "react-markdown";
import { fetchFormTemplate } from "@formstr/sdk/dist/formstr/nip101/fetchFormTemplate";
import { Event, generateSecretKey } from "nostr-tools";
import { Actions, NIP07Interactions } from "../../components/NIP07Interactions";
import { FormFields } from "./FormFields";
import { PrepareForm } from "./PrepareForm";

const { Text } = Typography;

interface FormFillerProps {
  formSpec?: Tag[];
  embedded?: boolean;
}

export const FormFiller: React.FC<FormFillerProps> = ({
  formSpec,
  embedded,
}) => {
  const { pubKey, formId } = useParams();
  const [formTemplate, setFormTemplate] = useState<Tag[] | null>(null);
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [thankYouScreen, setThankYouScreen] = useState(false);
  const [searchParams] = useSearchParams();
  const hideTitleImage = searchParams.get("hideTitleImage") === "true";
  const hideDescription = searchParams.get("hideDescription") === "true";
  const navigate = useNavigate();

  const isPreview = !!formSpec;

  if (!formId && !formSpec) {
    return null;
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
    if (!formId || !pubKey) {
      throw "Cant submit to a form that has not been published";
    }
    let formResponses = form.getFieldsValue(true);
    const responses: Response[] = Object.keys(formResponses).map(
      (fieldId: string) => {
        let answer = null;
        let message = null;
        if (formResponses[fieldId]) [answer, message] = formResponses[fieldId];
        return ["response", fieldId, answer, JSON.stringify({ message })];
      }
    );
    let anonUser = null;
    if (anonymous) {
      anonUser = generateSecretKey();
    }
    sendResponses(pubKey, formId, responses, anonUser).then(
      (val) => {
        console.log("Submitted!");
        setFormSubmitted(true);
        setThankYouScreen(true);
      },
      (err) => {
        console.log("some error", err);
      }
    );
  };

  console.log("Form template is....", formTemplate);
  if (!pubKey || !formId) {
    return <Text>INVALID FORM URL</Text>;
  }
  if (!formTemplate) {
    return (
      <PrepareForm
        pubKey={pubKey}
        formId={formId}
        formSpecCallback={function (fields: Tag[], _: Event): void {
          setFormTemplate(fields);
        }}
      />
    );
  }
  let name: string, settings: any, fields: Field[];
  if (formTemplate) {
    name = formTemplate.find((tag) => tag[0] === "name")?.[1] || "";
    settings = JSON.parse(
      formTemplate.find((tag) => tag[0] === "settings")?.[1] || "{}"
    );
    fields = formTemplate.filter((tag) => tag[0] === "field") as Field[];
    return (
      <FillerStyle $isPreview={isPreview}>
        {!formSubmitted && (
          <div className="filler-container">
            <div className="form-filler">
              {!hideTitleImage && (
                <FormTitle
                  className="form-title"
                  edit={false}
                  imageUrl={settings?.titleImageUrl}
                  formTitle={name}
                />
              )}
              {!hideDescription && (
                <div className="form-description">
                  <Text>
                    <Markdown>{settings?.description}</Markdown>
                  </Text>
                </div>
              )}

              <Form
                form={form}
                onFinish={() => {}}
                className={
                  hideDescription ? "hidden-description" : "with-description"
                }
              >
                <div>
                  <FormFields fields={fields} handleInput={handleInput} />
                  <SubmitButton
                    selfSign={settings.disallowAnonymous}
                    edit={false}
                    onSubmit={saveResponse}
                    form={form}
                    disabled={isPreview}
                  />
                </div>
              </Form>
            </div>
            <div className="branding-container">
              <Link to="/">
                <CreatedUsingFormstr />
              </Link>
              {!isMobile() && (
                <a
                  href="https://github.com/abhay-raizada/nostr-forms"
                  className="foss-link"
                >
                  <Text className="text-style">
                    Formstr is free and Open Source
                  </Text>
                </a>
              )}
            </div>
          </div>
        )}
        {embedded ? (
          formSubmitted && (
            <div className="embed-submitted">
              {" "}
              <Text>Response Submitted</Text>{" "}
            </div>
          )
        ) : (
          <ThankYouScreen
            isOpen={thankYouScreen}
            onClose={() => {
              if (!embedded) {
                navigate(`${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.SUBMISSIONS}`);
              } else {
                setThankYouScreen(false);
              }
            }}
          />
        )}
      </FillerStyle>
    );
  }
};
