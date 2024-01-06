import { getFormResponses } from "@formstr/sdk";
import { FormResponse } from "@formstr/sdk/dist/interfaces";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Responses = () => {
  const { formSecret } = useParams();
  const [responses, setResponses] = useState<FormResponse>({});

  const columns = [
    {
      key: "author",
      title: "Author",
      dataIndex: "author",
    },
    {
      key: "Submissions",
      title: "Submissions",
      dataIndex: "Submissions",
    },
  ];

  useEffect(() => {
    async function fetchResponses() {
      if (!formSecret) {
        throw Error("form secret required to view responses");
      }
      const responses = await getFormResponses(formSecret);
      setResponses(responses);
    }
    fetchResponses();
  }, [formSecret]);

  const getData = () => {
    return Object.keys(responses).map((key) => {
      return {
        key,
        author: responses[key].authorName,
        Submissions: responses[key].responses.length,
        responses: responses[key].responses,
      };
    });
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={getData()}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => {
            let lastResponse = record.responses[record.responses.length - 1];
            return (
              <div>
                <Table
                  key={lastResponse[0].questionLabel + " Table"}
                  columns={[
                    {
                      key: "question",
                      title: "Question",
                      dataIndex: "question",
                    },
                    {
                      key: "answer",
                      title: "Answer",
                      dataIndex: "answer",
                    },
                  ]}
                  dataSource={lastResponse.map((question) => {
                    return {
                      key: question.questionId,
                      question: question.questionLabel,
                      answer: question.answer,
                    };
                  })}
                  pagination={false}
                />
              </div>
            );
          },
        }}
      />
    </>
  );
};
