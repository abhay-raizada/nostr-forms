import { Form, Input, Switch } from "antd";
import { useEffect } from "react";

const FormSettings = (props) => {
  const { form, onFormFinish, onFinishFailed } = props;

  useEffect(() => {
    if (form.getFieldValue("selfSign") === undefined) {
      form.setFieldValue("selfSign", false);
    }
    if (form.getFieldValue("showOnGlobal") === undefined) {
      form.setFieldValue("showOnGlobal", false);
    }
  });

  function handleNameChange(event) {
    form.setFieldValue("name", event.target.value);
  }

  function handleDescriptionChange(event) {
    form.setFieldValue("description", event.target.value);
  }

  function handleSelfSign(checked) {
    form.setFieldValue("selfSign", checked);
  }

  function handleShowOnGlobal(checked) {
    form.setFieldValue("showOnGlobal", checked);
  }

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <Form
      {...formItemLayout}
      labelWrap
      onFinish={onFormFinish}
      form={form}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="name"
        label="Name of the form"
        rules={[{ required: true }]}
      >
        <Input
          defaultValue={form.getFieldValue("name")}
          onChange={handleNameChange}
        />
      </Form.Item>
      <Form.Item name="description" label="Enter form description">
        {" "}
        <Input
          defaultValue={form.getFieldValue("description")}
          onChange={handleDescriptionChange}
        />{" "}
      </Form.Item>
      <Form.Item name="selfSign" label="Ask users to sign their submissions">
        <Switch
          defaultChecked={form.getFieldValue("selfSign")}
          onChange={handleSelfSign}
        />
      </Form.Item>
      <Form.Item
        name="showOnGlobal"
        label="Show your form on the global feed"
      >
        <Switch
          onChange={handleShowOnGlobal}
        />
      </Form.Item>
    </Form>
  );
};

export default FormSettings;
