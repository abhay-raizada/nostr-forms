import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const Response = (props) => {
  let { responses, userInfo } = props;

  return (
    <>
      <Title level={3}> Responses</Title>

      {!responses?.length ? (
        <Text level={3}> No responses matching this filter</Text>
      ) : null}

      {responses.map((response, index) => {
        let questions = JSON.parse(response.plaintext);
        return (
          <Card
            key={index}
            title={
              userInfo[response.pubkey]?.name ||
              `Anonymous Response  ${index + 1}`
            }
          >
            {questions.map((question) => {
              return (
                <Card key={question.tag} type="inner" title={question.question}>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div>{question.inputValue}</div>
                    {question.otherMessage && (
                      <div>
                        User Input:
                        {question.otherMessage}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </Card>
        );
      })}
    </>
  );
};

export default Response;
