import React, { useState } from "react";
import {Button, Input, Form, Radio, Space, Row, Col, Divider} from "antd";
import { Typography } from "antd";
import { sendFormResponse } from "../../utils/nostr";
import { SignAndSubmit } from "./SignAndSubmit";

const { Title, Text } = Typography;

function NostrForm(props) {
  const { content, npub } = props;
  const { description, name, fields } = content;
  let selfSign = false;
  if (content.settings?.selfSignForms) {
    selfSign = content.settings.selfSignForms;
  }
  const formRef = React.useRef(null)
  const [formInputs, setFormInputs] = useState(() => {
    let fieldInputs = {};
    fields?.forEach((field) => {
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
  const [otherMessage, setOtherMessage] = useState("");

  function onOtherChange(event) {
    setOtherMessage(event.target.value);
  }

  const onFieldChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value);
    setFormInputs({ ...formInputs, [name]: value });
  };


  const handleSubmit = async (
    submitEvent,
    selfSignForm = false,
    onReadPubkey = (_) => {},
    onEncryptedResponse = () => {},
    onEventSigned = () => {}
  ) => {
    console.log("HANDLE SUBMIT", selfSignForm);
    let answerObject = fields.map((field) => {
      let { question, tag, answerType } = field;
      return {
        question,
        tag,
        answerType,
        inputValue: formInputs[field["tag"]],
        otherMessage: otherMessage,
      };
    });
    await formRef.current?.validateFields()

    await sendFormResponse(
      npub,
      answerObject,
      selfSignForm,
      onReadPubkey,
      onEncryptedResponse,
      onEventSigned
    );
    props.onSubmit();
  };

  const getField = (field) => {
    let { answerType, question, tag, numberConstraints } = field;
    switch (answerType) {
      case "string":
        return (
          <Form.Item
            label={<strong>{question}</strong>}
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
            label={<strong>{question}</strong>}
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
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Radio
                        value={choice.message}
                        name={tag}
                        style={{ textAlign: "left", margin: "10px" }}
                      >
                        {choice.message}
                      </Radio>
                      {choice.other && (
                        <Input
                          name={tag}
                          disabled={formInputs[tag] !== "other"}
                          onChange={onOtherChange}
                          placeholder="Enter your own choice"
                        />
                      )}
                    </div>
                  );
                })}
              </Space>
            </Radio.Group>
          </Form.Item>
        );
      case "text":
        return (
          <Form.Item
            label={<strong>{question}</strong>}
            name={tag}
            rules={[{ message: "Please Enter.." }]}
            layout="vertical"
          >
            <Input.TextArea
              name={tag}
              value={formInputs[tag]}
              onChange={onFieldChange}
            />
          </Form.Item>
        );
      case 'number':
        return (
            <Col>
              <Row>
          <Form.Item
              label={<strong>{question}</strong>}
              name={tag}
              layout="vertical"
              rules={[{
                validator: ({message}, value, cb) => {
                  const dotCount = (value.match(/\./g) || []).length;
                  if(value > numberConstraints?.max) {
                    cb(message)
                  } else if(value < numberConstraints?.min) {
                    cb(message)
                  } else if(!/^[\d.]+$/.test(value) || dotCount > 1) {
                    cb(message)
                  } else {
                    cb()
                  }
                },
                message: 'Only numbers allowed in the given range'
              }]}
            >
              <Input
                name={tag}
                value={formInputs[tag]}
                onChange={onFieldChange}
              />
            </Form.Item>
              </Row>
              <Row>
                {typeof numberConstraints?.max === 'number' && <div>Maximum Allowed Value: {numberConstraints?.max}</div>}
              </Row>
              <Row>
                {typeof numberConstraints?.min  === 'number' && <div>Minimum Allowed Value: {numberConstraints?.min}</div>}
              </Row>
            </Col>
        )
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
          ref={formRef}
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
        layout="vertical"
      >
        {fields?.map((field) => {
          return <Row>{getField(field)}<Divider /></Row>;
        })}
        {fields ? (
          !selfSign ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "10px",
                maxWidth: "80%",
              }}
            >
              <Button type="primary" onClick={handleSubmit}>
                Submit
              </Button>
              <Text style={{ minWidth: "15px" }}> or </Text>
              <SignAndSubmit
                onSubmit={(event) => {
                  handleSubmit(event, true);
                }}
              />
            </div>
          ) : (
            <SignAndSubmit onSubmit={handleSubmit} />
          )
        ) : null}
      </Form>
    </div>
  );
}

export default NostrForm;
