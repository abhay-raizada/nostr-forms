import { Field, Tag, Option, Response } from "@formstr/sdk/dist/formstr/nip101";
import FillerStyle from "./formFiller.style";
import FormTitle from "../CreateFormNew/components/FormTitle";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Form, Spin, Typography } from "antd";
import { ThankYouScreen } from "./ThankYouScreen";
import { SubmitButton } from "./SubmitButton/submit";
import { isMobile } from "../../utils/utility";
import { ReactComponent as CreatedUsingFormstr } from "../../Images/created-using-formstr.svg";
import Markdown from "react-markdown";
import { Event, generateSecretKey, nip19 } from "nostr-tools";
import { FormFields } from "./FormFields";
import { RequestAccess } from "./RequestAccess";
import { CheckRequests } from "./CheckRequests";
import { fetchFormTemplate } from "@formstr/sdk/dist/formstr/nip101/fetchFormTemplate";
import { useProfileContext } from "../../hooks/useProfileContext";
import { getAllowedUsers, getFormSpec } from "../../utils/formUtils";
import { IFormSettings } from "../CreateFormNew/components/FormSettings/types";
import { AddressPointer } from "nostr-tools/nip19";
import { LoadingOutlined } from "@ant-design/icons";
import { sendNotification } from "../../nostr/common";
import { sendResponses } from "../../nostr/common";

interface Rule {
  questionId: string;
  value: string;
}

interface AnswerSettings {
  conditions?: {
    rules: Rule[];
  };
}

const { Text } = Typography;

interface FormFillerProps {
  formSpec?: Tag[];
  embedded?: boolean;
}

export const FormFiller: React.FC<FormFillerProps> = ({
  formSpec,
  embedded,
}) => {
  const { naddr } = useParams();
  let isPreview: boolean = false;
  if (!naddr) isPreview = true;
  let decodedData;
  if (!isPreview) decodedData = nip19.decode(naddr!).data as AddressPointer;
  let pubKey = decodedData?.pubkey;
  let formId = decodedData?.identifier;
  let relays = decodedData?.relays;
  const { pubkey: userPubKey, requestPubkey } = useProfileContext();
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
  const viewKeyParams = searchParams.get("viewKey");
  const hideDescription = searchParams.get("hideDescription") === "true";
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  isPreview = !!formSpec;

  if (!formId && !formSpec) {
    return null;
  }

  const onKeysFetched = (keys: Tag[] | null) => {
    console.log("Keys got", keys);
    let editKey = keys?.find((k) => k[0] === "EditAccess")?.[1] || null;
    setEditKey(editKey);
  };

  const initialize = async (
    formAuthor: string,
    formId: string,
    relays?: string[]
  ) => {
    console.log("Author and id are", formAuthor, formId);
    if (!formEvent) {
      const form = await fetchFormTemplate(formAuthor, formId, relays);
      if (!form) {
        alert("Could not find the form");
        return;
      }
      setFormEvent(form);
      setAllowedUsers(getAllowedUsers(form));
      const formSpec = await getFormSpec(
        form,
        userPubKey,
        onKeysFetched,
        viewKeyParams
      );
      if (!formSpec) setNoAccess(true);
      setFormTemplate(formSpec);
    }
  };

  useEffect(() => {
    if (!(pubKey && formId)) {
      return;
    }
    initialize(pubKey, formId, relays);
  }, [formEvent, formTemplate, userPubKey]);

  const handleInput = (questionId: string, answer: string, message?: string) => {
    if (!answer || answer === "") {
      form.setFieldValue(questionId, null);
      setFormAnswers(prev => ({...prev, [questionId]: ""}));
      return;
    }
    form.setFieldValue(questionId, [answer, message]);
    setFormAnswers(prev => ({...prev, [questionId]: answer}));
  };

  const shouldShowQuestion = (question: Field): boolean => {
    try {
      const answerSettings = JSON.parse(question[5] || '{}') as AnswerSettings;
      const conditions = answerSettings.conditions;
      if (!conditions?.rules?.length) return true;
      return conditions.rules.every(rule => formAnswers[rule.questionId] === rule.value);
    } catch {
      return true;
    }
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
    sendResponses(pubKey, formId, responses, anonUser, true, relays).then(
      (res: any) => {
        console.log("Submitted!");
        sendNotification(formTemplate!, responses);
        setFormSubmitted(true);
        setThankYouScreen(true);
      }
    );
  };

  const renderSubmitButton = () => {
    console.log("Allowed users are", allowedUsers);
    if (isPreview) return null;
    if (allowedUsers.length === 0) {
      return (
        <SubmitButton
          selfSign={false}
          edit={false}
          onSubmit={saveResponse}
          form={form}
        />
      );
    } else if (!userPubKey) {
      return <Button onClick={requestPubkey}>Login to fill this form</Button>;
    } else if (userPubKey && !allowedUsers.includes(userPubKey)) {
      return <RequestAccess pubkey={pubKey!} formId={formId!} />;
    } else {
      return (
        <SubmitButton
          selfSign={true}
          edit={false}
          onSubmit={saveResponse}
          form={form}
        />
      );
    }
  };

  if ((!pubKey || !formId) && !isPreview) {
    return <Text>INVALID FORM URL</Text>;
  }
  if (!formEvent && !isPreview) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            display: "block",
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{ fontSize: 48, color: "#F7931A" }}
                spin
              />
            }
          />
        </Text>
      </div>
    );
  } else if (!isPreview && formEvent?.content !== "" && !userPubKey) {
    return (
      <>
        <Text>
          This form is access controlled and requires login to continue
        </Text>
        <Button
          onClick={() => {
            requestPubkey();
          }}
        >
          Login
        </Button>
      </>
    );
  }
  if (noAccess) {
    return (
      <>
        <Text>Your profile does not have access to view this form</Text>
        <RequestAccess pubkey={pubKey!} formId={formId!} />
      </>
    );
  }
  let name: string, settings: IFormSettings, fields: Field[];
  if (formTemplate) {
    name = formTemplate.find((tag) => tag[0] === "name")?.[1] || "";
    settings = JSON.parse(
      formTemplate.find((tag) => tag[0] === "settings")?.[1] || "{}"
    ) as IFormSettings;
    fields = formTemplate.filter((tag) => tag[0] === "field") as Field[];
    const visibleFields = fields.filter(shouldShowQuestion);
    
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
                onFinish={() => {}}
                className={
                  hideDescription ? "hidden-description" : "with-description"
                }
              >
                <div>
                <FormFields fields={visibleFields} handleInput={handleInput} />
                <>{renderSubmitButton()}</>
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
                let navigationUrl = editKey ? `/r/${pubKey}/${formId}` : `/`;
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
