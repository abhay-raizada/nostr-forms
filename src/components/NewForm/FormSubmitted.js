import { Button, notification, Typography } from "antd";

const FormSubmitted = (props) => {
  function constructFormUrl() {
    let hostname = window.location.host;
    if (hostname.includes("abhay-raizada")) {
      hostname += "/nostr-forms";
    }

    return "http://" + hostname + "/#/forms/" + props.formCredentials.publicKey;
  }
  const [api, contextHolder] = notification.useNotification();
  const { Text, Paragraph } = Typography;

  function saveFormLocally() {
    let saveObject = { ...props.formCredentials, name: props.formName };
    let forms = localStorage.getItem("formstr:forms");
    if (forms) {
      forms = JSON.parse(forms);
    }
    forms = forms || [];
    if (
      forms
        .map((form) => {
          return form.publicKey;
        })
        .includes(saveObject.publicKey)
    ) {
      api.warning({ message: "Form already saved" });
      return;
    }

    forms.push(saveObject);
    localStorage.setItem("formstr:forms", JSON.stringify(forms));
    api.info({ message: "Saved Successfully" });
  }

  let formUrl = constructFormUrl();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        alignItems: "center",
      }}
    >
      {contextHolder}
      <Text> Your form has been published! </Text>
      <div>
        <Text>
          {" "}
          The Form Can be found here:{" "}
          <Paragraph copyable>
            {" "}
            <a href={formUrl}>{formUrl}</a>{" "}
          </Paragraph>{" "}
        </Text>
      </div>
      <div>
        <Text>
          Private Key (needed to acces responses){" "}
          <Paragraph copyable> {props.formCredentials.privateKey} </Paragraph>{" "}
        </Text>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Button
          type="primary"
          onClick={saveFormLocally}
          style={{ margin: "10px" }}
        >
          {" "}
          Save locally{" "}
        </Button>
        <Button type="primary" disabled style={{ margin: "10px" }}>
          {" "}
          Save to nostr profile{" "}
        </Button>
      </div>
    </div>
  );
};

export default FormSubmitted;
