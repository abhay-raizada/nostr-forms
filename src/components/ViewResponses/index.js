import { Button, Card, Input, Form } from "antd";
import { useEffect, useState } from "react";
import { getFormResponses } from "../../utils/nostr";
import Analytics from "./Analytics";

function ViewResponses(props) {
  const [nsec, setNsec] = useState("");
  const [responses, setResponses] = useState([]);

  async function getResponses() {
    let resp = await getFormResponses(nsec);
    console.log("fetching", resp);
    setResponses(resp);
  }
  function handleInputchange(event) {
    setNsec(event.target.value);
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
              await getResponses();
              return;
            }}
            style={{ margine: "10px" }}
          >
            View Responses
          </Button>
        </Form.Item>
      </Form>

      {responses.length !== 0 && <Analytics responses={responses} />}

      {responses.map((response, index) => {
        let questions = JSON.parse(response);
        console.log("r", response);
        return (
          <>
            <Card title={"Response " + (index + 1)}>
              {questions.map((question) => {
                console.log(question);
                return (
                  <Card type="inner" title={question.question}>
                    {question.inputValue}
                  </Card>
                );
              })}
            </Card>
          </>
        );
      })}
    </div>
  );
}

export default ViewResponses;
