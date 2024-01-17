import { getFormResponses } from "@formstr/sdk";
import {
  FormResponses,
  V1Field,
  V1FormSpec,
  V1Response,
} from "@formstr/sdk/dist/interfaces";
import { Card, Divider, Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryStyle from "./summary.style";
import { Export } from "./Export";

const { Text } = Typography;

export const Responses = () => {
  const { formSecret } = useParams();
  const [allResponses, setAllResponses] = useState<FormResponses>({});
  const [questionMap, setQuestionMap] = useState<{ [key: string]: V1Field }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [formSummary, setFormSummary] = useState<V1FormSpec>({
    name: "Loading...",
    schemaVersion: "v1",
  });

  useEffect(() => {
    async function fetchResponses() {
      if (!formSecret) {
        throw Error("form secret required to view responses");
      }
      const responses = await getFormResponses(formSecret || "");
      setIsLoading(false);
      setAllResponses(responses.allResponses);
      setQuestionMap(responses.questionMap);
      setFormSummary(responses.formSummary);
    }
    fetchResponses();
  }, [formSecret, isLoading]);

  const getData = () => {
    return Object.keys(allResponses).map((authorId) => {
      const authorName = allResponses[authorId].authorName;
      const authorResponses = allResponses[authorId].responses;
      const authorSubmissions = authorResponses.length;
      const lastAuthorResponse = authorResponses[authorSubmissions - 1];
      const createdAt = lastAuthorResponse.createdAt;
      const answerObject: { [key: string]: string } = {
        author: authorName,
        createdAt: createdAt,
      };
      lastAuthorResponse.response.forEach((response: V1Response) => {
        answerObject[response.questionId] = response.displayAnswer;
      });
      return answerObject;
    });
  };

  const getFlatColumns = () => {
    const columns: Array<{
      key: string;
      title: string;
      dataIndex: string;
      fixed?: "left" | "right";
      width?: number;
    }> = [
      {
        key: "author",
        title: "Author",
        dataIndex: "author",
        fixed: "left",
        width: 25,
      },
      {
        key: "createdAt",
        title: "Created At",
        dataIndex: "createdAt",
        fixed: "left",
        width: 25,
      },
    ];
    for (const [questionId, field] of Object.entries(questionMap)) {
      columns.push({
        key: questionId,
        title: field.question,
        dataIndex: questionId,
        width: 50,
      });
    }
    return columns;
  };

  return (
    <div>
      <Card>
        <SummaryStyle>
          <Text className="heading">{formSummary.name}</Text>
          <Divider />
          <div className="response-count-container">
            <Text className="response-count">
              {Object.keys(allResponses).length}{" "}
            </Text>
            <Text className="response-count-label">response(s)</Text>
          </div>
        </SummaryStyle>
      </Card>

      <div
        style={{
          width: "100%",
          margin: "10px",
        }}
      >
        <Export
          questionMap={questionMap}
          answers={getData()}
          formName={formSummary.name}
        />
      </div>
      <Divider />
      <div style={{ overflow: "scroll" }}>
        <Table
          columns={getFlatColumns()}
          dataSource={getData()}
          pagination={false}
          loading={{
            spinning: isLoading,
            tip: "🔎 Looking for your responses...",
          }}
          scroll={{ x: 1500 }}
        />
      </div>
    </div>
  );
};
