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
import { useState } from "react";
import { Form, Typography } from "antd";
import { ThankYouScreen } from "./ThankYouScreen";
import { SubmitButton } from "./SubmitButton/submit";
import { isMobile } from "../../utils/utility";
import { ReactComponent as CreatedUsingFormstr } from "../../Images/created-using-formstr.svg";
import { ROUTES as GLOBAL_ROUTES } from "../../constants/routes";
import { ROUTES } from "../../old/containers/MyForms/configs/routes";
import Markdown from "react-markdown";
import { Event, generateSecretKey } from "nostr-tools";
import { FormFields } from "./FormFields";
import { PrepareForm } from "./PrepareForm";
import { hexToBytes } from "@noble/hashes/utils";
import { RequestAccess } from "./RequestAccess";
import { CheckRequests } from "./CheckRequests";

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
  const [formTemplate, setFormTemplate] = useState<Tag[] | null>(
    formSpec || null
  );
  const [form] = Form.useForm();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [thankYouScreen, setThankYouScreen] = useState(false);
  const [votingKey, setVotingKey] = useState<string | null>(null);
  const [checkingEligibility, setCheckingEligibility] =
    useState<boolean>(false);
  const [submitAccess, setSubmitAccess] = useState(true);
  const [signingKey, setSigningKey] = useState<string | undefined>();
  const [formEvent, setFormEvent] = useState<Event | undefined>();
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

  const isPoll = (tags?: Tag[]) => {
    if (!formTemplate && !tags) return;
    else {
      const settingsTag = (formTemplate || tags)!.find(
        (tag) => tag[0] === "settings"
      );
      if (!settingsTag) return;
      const settings = JSON.parse(settingsTag[1] || "{}");
      return settings.isPoll;
    }
  };

  const checkVoterEligible = async (formEvent: Event) => {
    console.log("isPoll? ", isPoll(formEvent.tags));
    if (!isPoll(formEvent.tags)) return;
    setCheckingEligibility(true);
    let voterTags = formEvent.tags.filter((tag) => tag[0] === "v");
    let pubKey = await window.nostr.getPublicKey();
    let encryptedVoterSecret = formEvent.tags.find(
      (tag) => tag[0] === "key" && tag[1] === pubKey
    );
    console.log("found encrypted voter secret as", encryptedVoterSecret);
    let encryptedVoterId: string;
    if (!encryptedVoterSecret || !encryptedVoterSecret[4]) {
      setVotingKey(null);
      setSubmitAccess(false);
      return;
    } else {
      encryptedVoterId = encryptedVoterSecret[4];
    }
    const promises: Promise<void>[] = [];
    console.log("Searching voter ids in", voterTags);
    voterTags.forEach((tags: string[]) => {
      let candidateVoterId = tags[1];
      const promise = window.nostr.nip44
        .decrypt(candidateVoterId, encryptedVoterId)
        .then((voterKey: string) => {
          console.log("Found the voting key", voterKey);
          setVotingKey(voterKey);
          setCheckingEligibility(false);
        })
        .catch((e) => {
          console.log(`not candidate ${candidateVoterId}`);
        });
      promises.push(promise);
    });
    Promise.all(promises).then(() => {
      console.log("After all promises boting key is", votingKey);
      if (!votingKey) {
        setSubmitAccess(false);
      }
    });
  };

  const checkSigningKey = async (formEvent: Event) => {
    let pubKey = await window.nostr.getPublicKey();
    let encryptedFormSecret = formEvent.tags.find(
      (tag) => tag[0] === "key" && tag[1] === pubKey
    )?.[3];
    if (encryptedFormSecret) {
      window.nostr.nip44
        .decrypt(formEvent.pubkey, encryptedFormSecret)
        .then((privateKey: string) => {
          setSigningKey(privateKey);
        });
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
    if (votingKey) anonUser = hexToBytes(votingKey);
    if (!votingKey && anonymous) {
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

  if ((!pubKey || !formId) && !isPreview) {
    return <Text>INVALID FORM URL</Text>;
  }
  if (!formTemplate && !isPreview) {
    return (
      <PrepareForm
        pubKey={pubKey!}
        formId={formId!}
        formSpecCallback={function (fields: Tag[], formEvent: Event): void {
          setFormTemplate(fields);
          checkVoterEligible(formEvent);
          checkSigningKey(formEvent);
          setFormEvent(formEvent);
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
        {signingKey && !isPreview ? (
          <CheckRequests
            pubkey={pubKey!}
            formId={formId!}
            secretKey={signingKey}
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
                  <FormFields fields={fields} handleInput={handleInput} />
                  <>
                    {submitAccess ? (
                      <SubmitButton
                        selfSign={settings.disallowAnonymous}
                        edit={false}
                        onSubmit={saveResponse}
                        form={form}
                        disabled={
                          isPreview || (checkingEligibility && !votingKey)
                        }
                        disabledMessage={
                          checkingEligibility && !votingKey
                            ? "Checking Eligibilty"
                            : "Disabled"
                        }
                      />
                    ) : (
                      <RequestAccess pubkey={pubKey!} formId={formId!} />
                    )}
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
