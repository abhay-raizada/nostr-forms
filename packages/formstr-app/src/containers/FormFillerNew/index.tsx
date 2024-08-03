import { Field, Tag, Option, Response } from "@formstr/sdk/dist/formstr/nip101";
import { sendResponses } from "@formstr/sdk/dist/formstr/nip101/sendResponses";
import FillerStyle from "./formFiller.style";
import FormTitle from "../CreateFormNew/components/FormTitle";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Typography } from "antd";
import { ThankYouScreen } from "./ThankYouScreen";
import { SubmitButton } from "./SubmitButton/submit";
import { isMobile } from "../../utils/utility";
import { ReactComponent as CreatedUsingFormstr } from "../../Images/created-using-formstr.svg";
import { ROUTES as GLOBAL_ROUTES } from "../../constants/routes";
import { ROUTES } from "../../old/containers/MyForms/configs/routes";
import Markdown from "react-markdown";
import {
  Event,
  generateSecretKey,
} from "nostr-tools";
import { FormFields } from "./FormFields";
import { hexToBytes } from "@noble/hashes/utils";
import { RequestAccess } from "./RequestAccess";
import { CheckRequests } from "./CheckRequests";
import { fetchFormTemplate } from "@formstr/sdk/dist/formstr/nip101/fetchFormTemplate";
import { useProfileContext } from "../../hooks/useProfileContext";
import { getAllowedUsers, getFormSpec } from "../../utils/formUtils";

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

  const { pubkey: userPubKey, requestPubkey } = useProfileContext();
  console.log("User Pubkey is", userPubKey)
  const [formTemplate, setFormTemplate] = useState<Tag[] | null>(
    formSpec || null
  );
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [noAccess, setNoAccess] = useState<boolean>(false);
  const [editKey, setEditKey] = useState<string | undefined | null>();
  const [allowedUsers, setAllowedUsers] = useState<string[]>([]);
  const [thankYouScreen, setThankYouScreen] = useState(false);
  const [formEvent, setFormEvent] = useState<Event | undefined>();
  const [searchParams] = useSearchParams();
  const hideTitleImage = searchParams.get("hideTitleImage") === "true";
  const viewKeyParams = searchParams.get("viewKey")
  const hideDescription = searchParams.get("hideDescription") === "true";
  const navigate = useNavigate();

  const isPreview = !!formSpec;

  if (!formId && !formSpec) {
    return null;
  }

  const onKeysFetched = (keys: Tag[] | null) => {
    let editKey = keys?.find((k) => k[0] === "EditAccess")?.[1] || null
    setEditKey(editKey);
  }

  const initialize = async (formAuthor: string, formId: string) => {
    console.log("Author and id are", formAuthor, formId)
    if (!formEvent) {
      const form = await fetchFormTemplate(formAuthor, formId);
      if (!form) { alert("Could not find the form"); return; }
      setFormEvent(form);
      setAllowedUsers(getAllowedUsers(form))
      const formSpec = await getFormSpec(form, userPubKey, onKeysFetched, viewKeyParams);
      if (!formSpec)
        setNoAccess(true)
      setFormTemplate(formSpec);
    }
  }

  useEffect(() => {
    if (!(pubKey && formId)) {
      return;
    }
    initialize(pubKey, formId);
  }, [formEvent, formTemplate, userPubKey]);

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

  const renderSubmitButton = () => {
    if (isPreview) return null;
    if (allowedUsers.length === 0) {
      return <SubmitButton
        selfSign={false}
        edit={false}
        onSubmit={saveResponse}
        form={form}
      />
    }
    else if (!userPubKey) {
      return <Button onClick={requestPubkey}>Login to fill this form</Button>
    }
    else if (userPubKey && !allowedUsers.includes(userPubKey)) {
      return <RequestAccess pubkey={pubKey!} formId={formId!} />
    }
    else {
      return <SubmitButton
        selfSign={true}
        edit={false}
        onSubmit={saveResponse}
        form={form}
      />
    }
  }

  if ((!pubKey || !formId) && !isPreview) {
    return <Text>INVALID FORM URL</Text>;
  }
  if (!formEvent) {
    return <Text>Loading...</Text>
  }
  if (formEvent.content !== "" && !userPubKey) {
    return <><Text>This form is access controlled and requires login to continue</Text>
      <Button onClick={() => { requestPubkey() }}>Login</Button></>
  }
  if (noAccess) {
    return <><Text>Your profile does not have access to view this form</Text>
      <RequestAccess pubkey={pubKey!} formId={formId!} /></>
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
        {editKey && !isPreview ? (
          <CheckRequests
            pubkey={pubKey!}
            formId={formId!}
            secretKey={editKey}
            formEvent={formEvent!}
          />
        ) : null}
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
                onFinish={() => { }}
                className={
                  hideDescription ? "hidden-description" : "with-description"
                }
              >
                <div>
                  <FormFields fields={fields} handleInput={handleInput} />
                  <>
                    {renderSubmitButton()}
                  </>
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
                let navigationUrl = editKey
                  ? `/r/${pubKey}/${formId}`
                  : `${GLOBAL_ROUTES.MY_FORMS}/${ROUTES.SUBMISSIONS}`;
                navigate(navigationUrl);
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
