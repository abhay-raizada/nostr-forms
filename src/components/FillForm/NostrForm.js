import { useState } from "react";
import { Button, Input, Form, Radio, Space } from "antd";
import { Typography } from "antd";
import { sendFormResponse } from "../../utils/nostr";

const { Title, Text } = Typography;

function NostrForm(props) {
  const { content, npub } = props;
  const { description, name, fields } = content;
  let privateKey = "";
  if (content.privateKey) {
    privateKey = content.privateKey;
  }
  console.log("choices!", content);

  const [formInputs, setFormInputs] = useState(() => {
    let fieldInputs = {};
    fields?.map((field) => {
      let { answerType, tag } = field;
      if (answerType === "string") {
        fieldInputs[tag] = "";
      }
      if (answerType === "singleChoice") {
        fieldInputs[tag] = field.choices[0].message;
      }
    });
    return fieldInputs;
  });

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormInputs({ ...formInputs, [name]: value });
  };

  const handleSubmit = (event) => {
    console.log("safdsfsddf", npub, formInputs, fields);
    let answerObject = fields.map((field) => {
      let { question, tag, answerType } = field;
      return {
        question,
        tag,
        answerType,
        inputValue: formInputs[field["tag"]],
      };
    });
    sendFormResponse(npub, answerObject);
    props.onSubmit();
  };

  const getField = (field) => {
    let { answerType, question, tag } = field;
    switch (answerType) {
      case "string":
        return (
          <Form.Item
            label={question}
            name={tag}
            rules={[{ message: "Please Enter.." }]}
          >
            <Input
              name={tag}
              value={formInputs[tag]}
              onChange={onFieldChange}
            />
          </Form.Item>
        );
      case "singleChoice":
        return (
          <Form.Item
            label={question}
            name={tag}
            rules={[{ message: "Select.." }]}
          >
            <Radio.Group
              name={tag}
              onChange={onFieldChange}
              value={formInputs[tag]}
              defaultValue={field.choices[0].message}
            >
              <Space
                direction="vertical"
                style={{
                  display: "flex",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                }}
              >
                {field.choices.map((choice) => {
                  return (
                    <Radio
                      value={choice.message}
                      name={tag}
                      style={{ textAlign: "left" }}
                    >
                      {choice.message}
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Title label="Form Name:">{name}</Title>
      <Text label="Form Description">{description}</Text>
      <Form
        name="basic"
        labelCol={{
          span: 15,
        }}
        labelWrap
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
          overflow: "auto",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
        onFinishFailed={handleSubmit}
        autoComplete="off"
      >
        {fields?.map((field) => {
          return getField(field);
        })}
        {fields ? (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        ) : null}
      </Form>

      {privateKey && (
        <Text mark style={{ margin: "10px" }}>
          {" "}
          This is a public form to view responses use private key: {
            privateKey
          }{" "}
        </Text>
      )}
    </div>
  );
}

export default NostrForm;
