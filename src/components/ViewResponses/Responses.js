import { Card, Typography } from "antd";

const Response = (props) => {
  let { allResponses, userInfo } = props;

  const { Title } = Typography;
  allResponses && allResponses.length !== 0 && (
    <Title level={3}> Responses</Title>
  );
  allResponses.map((response, index) => {
    let questions = JSON.parse(response.plaintext);
    console.log("r", response);
    return (
      <>
        <Card
          title={
            userInfo[response.pubkey]?.name ||
            "Anonymous Response " + (index + 1)
          }
        >
          {questions.map((question) => {
            console.log(question);
            return (
              <Card type="inner" title={question.question}>
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
      </>
    );
  });
};

export default Response;
