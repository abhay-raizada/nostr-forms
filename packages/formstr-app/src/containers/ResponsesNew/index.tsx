import { useState } from "react";
import { Event, getPublicKey, nip44 } from "nostr-tools";
import { useParams } from "react-router-dom";
import { Field, Tag } from "@formstr/sdk/dist/formstr/nip101";
import { fetchFormResponses } from "@formstr/sdk/dist/formstr/nip101/fetchFormResponses";
import SummaryStyle from "./summary.style";
import { Card, Divider, Table, Typography } from "antd";
import ResponseWrapper from "./Responses.style";
import { isMobile } from "../../utils/utility";
import { PrepareForm } from "../FormFillerNew/PrepareForm";
import { Actions, NIP07Interactions } from "../../components/NIP07Interactions";
import { hexToBytes } from "@noble/hashes/utils";

const { Text } = Typography;

export const Response = () => {
  const [responses, setResponses] = useState<Event[] | undefined>(undefined);
  const [formSpec, setFormSpec] = useState<Tag[] | undefined>(undefined);
  const [encryptedSigningKey, setEncryptedSigningKey] = useState<
    string | null | undefined
  >(undefined);
  const [signingKey, setSigningKey] = useState<string | null | undefined>(
    undefined
  );
  const { pubKey, formId } = useParams();

  const getEncryptedSigningKey = (formEvent: Event, userPubkey: string) => {
    let key = formEvent.tags.find(
      (tag) => tag[0] === "key" && tag[1] === userPubkey
    );
    if (!key) return null;
    else return key[3] || null;
  };

  const getInputs = (responseEvent: Event) => {
    if (responseEvent.content === "" && !signingKey) {
      return responseEvent.tags.filter((tag) => tag[0] === "response");
    } else if (signingKey) {
      console.log(
        "signing key is present and is",
        signingKey,
        "corresponding pub key is",
        getPublicKey(hexToBytes(signingKey))
      );
      let conversationKey = nip44.v2.utils.getConversationKey(
        signingKey,
        responseEvent.pubkey
      );
      console.log("ConversationKey is", conversationKey);
      let decryptedContent = nip44.v2.decrypt(
        responseEvent.content,
        conversationKey
      );
      try {
        return JSON.parse(decryptedContent).filter(
          (tag: Tag) => tag[0] === "response"
        );
      } catch (e) {
        return [];
      }
    }
    return [];
  };

  const getData = () => {
    let answers: Array<{
      [key: string]: string;
    }> = [];
    (responses || []).forEach((response) => {
      let inputs = getInputs(response) as Tag[];
      if (inputs.length === 0) return;
      let answerObject: {
        [key: string]: string;
      } = {
        key: response.pubkey,
        createdAt: new Date(response.created_at * 1000).toDateString(),
        authorName: "",
      };
      inputs.forEach((input) => {
        answerObject[input[1]] = input[2];
      });
      answers.push(answerObject);
    });
    return answers;
  };

  const getFormName = () => {
    if (!formSpec) return "";

    let nameTag = formSpec.find((tag) => tag[0] === "name");
    if (nameTag) return nameTag[1] || "";
    return "";
  };

  const getColumns = () => {
    const columns: Array<{
      key: string;
      title: string;
      dataIndex: string;
      fixed?: "left" | "right";
      width?: number;
    }> = [
      {
        key: "createdAt",
        title: "Created At",
        dataIndex: "createdAt",
        fixed: "left",
        width: isMobile() ? 10 : 20,
      },
      {
        key: "author",
        title: "Author",
        dataIndex: "author",
        width: isMobile() ? 10 : 20,
      },
    ];
    let fields =
      formSpec?.filter((field) => field[0] === "field") || ([] as Field[]);
    fields.forEach((field) => {
      let [_, fieldId, __, label, ___, ____] = field;
      columns.push({
        key: fieldId,
        title: label,
        dataIndex: fieldId,
        width: 12,
      });
    });
    return columns;
  };

  if (!pubKey || !formId) return <Text>Invalid url</Text>;

  if (encryptedSigningKey && !signingKey) {
    return (
      <NIP07Interactions
        action={Actions.NIP44_DECRYPT}
        ModalMessage={
          "Please approve decryption of the signing key for this form"
        }
        cipherText={encryptedSigningKey}
        senderPubKey={pubKey}
        callback={(signingKey: string | Event) => {
          setSigningKey(signingKey as string);
        }}
      />
    );
  }
  if (!!formSpec)
    return (
      <div>
        <SummaryStyle>
          <div className="summary-container">
            <Card>
              <Text className="heading">{getFormName()}</Text>
              <Divider />
              <div className="response-count-container">
                <Text className="response-count">
                  {responses ? responses.length : "Loading..."}{" "}
                </Text>
                <Text className="response-count-label">response(s)</Text>
              </div>
            </Card>
          </div>
        </SummaryStyle>
        <ResponseWrapper>
          {/* <Export
          questionMap={questionMap}
          answers={getData()}
          formName={formSummary.name}
        /> */}

          <div style={{ overflow: "scroll", marginBottom: 60 }}>
            <Table
              columns={getColumns()}
              dataSource={getData()}
              pagination={false}
              loading={{
                spinning: !!!responses,
                tip: "🔎 Looking for your responses...",
              }}
              scroll={{ x: isMobile() ? 900 : 1500, y: "calc(65% - 400px)" }}
            />
          </div>
        </ResponseWrapper>
      </div>
    );
  else
    return (
      <PrepareForm
        pubKey={pubKey}
        formId={formId}
        formSpecCallback={(formSpec: Tag[], formEvent: Event) => {
          setFormSpec(formSpec);
          window.nostr.getPublicKey().then((userPubkey: string) => {
            let signingKey = getEncryptedSigningKey(formEvent, userPubkey);
            setEncryptedSigningKey(signingKey);
            fetchFormResponses(pubKey, formId).then((value) => {
              setResponses(value);
            });
          });
        }}
      />
    );
};
