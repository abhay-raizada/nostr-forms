import { useEffect, useState } from "react";
import { Event, nip44 } from "nostr-tools";
import { useParams } from "react-router-dom";
import { Field, Tag } from "@formstr/sdk/dist/formstr/nip101";
import { fetchFormTemplate } from "@formstr/sdk/dist/formstr/nip101/fetchFormTemplate";
import { fetchFormResponses } from "@formstr/sdk/dist/formstr/nip101/fetchFormResponses";
import SummaryStyle from "./summary.style";
import { Card, Divider, Table, Typography } from "antd";
import ResponseWrapper from "./Responses.style";
import { isMobile } from "../../utils/utility";
import { PrepareResponses } from "./PrepareResponses";

const { Text } = Typography;

export const Response = () => {
  const [responses, setResponses] = useState<Event[] | undefined>(undefined);
  const [formSpec, setFormSpec] = useState<Tag[] | undefined>(undefined);
  const [signingKey, setSigningKey] = useState<string | undefined>(undefined);
  const { pubKey, formId } = useParams();

  const getForm = async () => {
    if (!(pubKey && formId)) return;
    const formEvent = await fetchFormTemplate(pubKey, formId);
    setFormSpec(formEvent?.tags);
    const responses = await fetchFormResponses(pubKey, formId);
    setResponses(responses);
  };

  const getInputs = (responseEvent: Event) => {
    if (responseEvent.content === "") {
      return responseEvent.tags.filter((tag) => tag[0] === "response");
    } else if (signingKey) {
      let conversationKey = nip44.v2.utils.getConversationKey(
        signingKey,
        responseEvent.pubkey
      );
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
      let inputs = response.tags.filter((tag) => tag[0] === "response");
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

  useEffect(() => {
    getForm();
  }, []);

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
      <PrepareResponses
        pubKey={pubKey}
        formId={formId}
        responseCallback={(formSpec: Tag[], signingKey?: string) => {
          setFormSpec(formSpec);
          if (signingKey) setSigningKey(signingKey);
        }}
      />
    );
};
