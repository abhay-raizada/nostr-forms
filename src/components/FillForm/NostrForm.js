import { useState } from "react";
import { Button, Input, Form, Checkbox, message } from "antd";
import { Typography } from "antd";
import { sendFormResponse } from "../../utils/nostr";

const { Title } = Typography;

function NostrForm(props) {
  const { content, npub } = props;
  const { description, name, fields } = content;

  console.log("c, np", content, npub, name, description);

  const [formInputs, setFormInputs] = useState(() => {
    let fieldInputs = {};
    fields?.map(({ answerType, tag }) => {
      if (answerType === "string") {
        fieldInputs[tag] = "";
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
    console.log(npub, formInputs, fields);
    let answerObject = fields.map((field) => {
      return { ...field, inputValue: formInputs[field["tag"]] };
    });
    sendFormResponse(npub, answerObject);
  };

  const getField = (answerType, question, tag) => {
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
            {/* <Input
              name={tag}
              value={formInputs[tag]}
              onChange={onFieldChange}
              id="blah"
            ></Input>
          </> */}
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
        <Form.Item label="Form Name:">{name}</Form.Item>
        <Form.Item label="Form Description">{description}</Form.Item>
        {fields?.map(({ answerType, question, tag }) => {
          return getField(answerType, question, tag);
        })}
        {fields ? (
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        ) : null}
      </Form>
    </div>
  );
}

export default NostrForm;
