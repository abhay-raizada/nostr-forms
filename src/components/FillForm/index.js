import { useEffect, useState } from "react";
// import { Button, Input } from "antd";
import { getFormTemplate } from "../../utils/nostr";
import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { useParams } from "react-router-dom";
import NostrForm from "./NostrForm";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
const FillForm = (props) => {
  const [npubState, setNpubState] = useState("");
  const [formTemplate, setFormTemplate] = useState("");
  const [finished, setFinished] = useState(false);
  const { npub } = useParams();
  const { Text } = Typography;

  useEffect(() => {
    if (npub) {
      fetchFormTemplate(npub);
    }
  }, []);

  async function fetchFormTemplate(npubInput) {
    console.log("npub", npubInput);

    const template = await getFormTemplate(npubInput);
    setFormTemplate(template[0]?.content);
  }
  function handleInput(event) {
    console.log("event", event);
    setNpubState(event.target.value);
  }
  return (
    <>
      {!npub && !formTemplate && !finished && (
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
            onFinish={() => {
              fetchFormTemplate(npubState);
            }}
            onFinishFailed={() => {
              fetchFormTemplate(npubState);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="enter form public key"
              name="npub"
              rules={[
                {
                  required: true,
                  message: "Please input your npub!",
                },
              ]}
            >
              <Input
                placeholder="Please input your npub"
                onChange={handleInput}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
      {formTemplate && !finished && (
        <NostrForm
          content={JSON.parse(formTemplate)}
          npub={npub || npubState}
          onSubmit={() => {
            setFinished(true);
          }}
        />
      )}
    </>
  );
};
export default FillForm;
