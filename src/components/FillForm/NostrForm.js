import { useState } from "react";
import { Button, Input, Form, Checkbox, message, Radio } from "antd";
import { Typography } from "antd";
import { sendFormResponse } from "../../utils/nostr";

const { Title } = Typography;

function NostrForm(props) {
  const { content, npub } = props;
  const { description, name, fields } = content;
  console.log("choices!", content);

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
    console.log("safdsfsddf", npub, formInputs, fields);
    let answerObject = fields.map((field) => {
      return { ...field, inputValue: formInputs[field["tag"]] };
    });
    sendFormResponse(npub, answerObject);
    props.onSubmit();
  };

  const getField = (field) => {
    let { answerType, question, tag } = field;
    console.log("abswer type");
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
            >
              {field.choices.map((choice) => {
                return (
                  <Radio value={choice.message} name={tag}>
                    {choice.message}
                  </Radio>
                );
              })}
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
        {fields?.map((field) => {
          return getField(field);
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
