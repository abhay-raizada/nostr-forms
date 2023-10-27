import { useEffect, useState } from "react";
// import { Button, Input } from "antd";
import { getFormTemplate, getUserNpubByNip07 } from "../../utils/nostr";
import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { useParams } from "react-router-dom";
import NostrForm from "./NostrForm";

const FillForm = (props) => {
  const [npubState, setNpubState] = useState("");
  const [formTemplate, setFormTemplate] = useState("");
  const [finished, setFinished] = useState(false);
  const [userNpub, setUserNpub] = useState("");
  const { npub } = useParams();
  const { Text } = Typography;

  useEffect(() => {
    if (npub) {
      fetchFormTemplate(npub);
    }
    if (userNpub?.length === 0){
      setUserNpub(getUserNpubByNip07());
    }
  }, [npub, userNpub]);

  async function fetchFormTemplate(npubInput) {
    const template = await getFormTemplate(npubInput);
    setFormTemplate(template[0]?.content);
  }
  function handleInput(event) {
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

      {!formTemplate && npub && (
        <Text> Please wait while form is being fetched..</Text>
      )}

      {finished && <Text> Form has been submitted! </Text>}
    </>
  );
};
export default FillForm;
