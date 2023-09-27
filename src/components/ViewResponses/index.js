import { Button, Input, Form, Typography } from "antd";
import { useEffect, useState } from "react";
import { getFormResponses, getUserKind0s } from "../../utils/nostr";
import Analytics from "./Analytics";
import { useParams } from "react-router";
import Response from "./Responses";

function ViewResponses() {
  const [nsecState, setNsecState] = useState("");
  const [responses, setResponses] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const { nsec } = useParams();
  const { Text } = Typography;

  useEffect(() => {
    if (nsec) {
      getResponses(nsec);
    }
  });

  async function getResponses(nsecInput) {
    let resp = await getFormResponses(nsecInput);
    setResponses(resp);
    let pubkeysList = resp.map((r) => {
      return r.pubkey;
    });
    let userKind0 = await getUserKind0s(pubkeysList);
    let userInf = {};
    userKind0.forEach((kind0) => {
      userInf[kind0.pubkey] = JSON.parse(kind0.content);
    });
    console.log("UI", userInfo);
    if (Object.keys(userInfo).length === 0) {
      setUserInfo(userInf);
    }
  }
  function handleInputchange(event) {
    setNsecState(event.target.value);
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!nsec && (
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          labelWrap
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            alignContent: "center",
            flexDirection: "column",
          }}
        >
          <Form.Item label="enter form private key">
            <Input
              type="text"
              placeholder="Enter form nsec"
              onChange={handleInputchange}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              onClick={async () => {
                await getResponses(nsecState);
                return;
              }}
              style={{ margine: "10px" }}
            >
              View Responses
            </Button>
          </Form.Item>
        </Form>
      )}
      {responses.length !== 0 && <Analytics responses={responses} />}
      <Response allResponses={responses} userInfo={userInfo} />
      {/* {responses.length !== 0 && <Title level={3}> Responses</Title>}
      {responses.map((response, index) => {
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
      })} */}
      {nsec && responses.length === 0 && (
        <Text>
          {" "}
          Searching for responses... If it takes a while there are probably no
          responses yet.
        </Text>
      )}
    </div>
  );
}

export default ViewResponses;
