import { getFormResponses } from "@formstr/sdk";
import { FormResponse } from "@formstr/sdk/dist/interfaces";
import { Table, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const { Text } = Typography;

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
        author: responses[key].authorName || "Anonymous",
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
        expandable={{
          expandedRowRender: (record) => {
            return (
              <div>
                {record.responses.map((response, index) => {
                  return (
                    <>
                      <Text> Submission {index + 1}</Text>
                      <Table
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
                        dataSource={response.map((question) => {
                          return {
                            key: question.questionId,
                            question: question.questionId,
                            answer: question.answer,
                          };
                        })}
                      />
                    </>
                  );
                })}
              </div>
            );
          },
        }}
      />
    </>
  );
};
