import { getFormResponses } from "@formstr/sdk";
import { FormResponses, V1Field } from "@formstr/sdk/dist/interfaces";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Responses = () => {
  const { formSecret } = useParams();
  const [allResponses, setAllResponses] = useState<FormResponses>({});
  const [questionMap, setQuestionMap] = useState<{ [key: string]: V1Field }>(
    {}
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchResponses() {
      if (!formSecret) {
        throw Error("form secret required to view responses");
      }
      const responses = await getFormResponses(formSecret || "");
      console.log("Responsesssss is,");
      setIsLoading(false);
      setAllResponses(responses.allResponses);
      setQuestionMap(responses.questionMap);
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
      lastAuthorResponse.response.forEach((response) => {
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
        key: "CreatedAt",
        title: "Created At",
        dataIndex: "CreatedAt",
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
