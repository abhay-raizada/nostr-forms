import { Card, Typography, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { constructFormUrl, constructResponseUrl } from "../../utils/utility";

const MyForms = () => {
  const [tableForms, setTableForms] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState({});
  const { Text, Title } = Typography;

  useEffect(() => {
    let forms = localStorage.getItem("formstr:forms");
    if (forms) {
      forms = JSON.parse(forms);
    }
    forms = forms || [];
    let tableForms = forms
      .map((form, index) => {
        let formUrl = constructFormUrl(form.publicKey);
        let responseUrl = constructResponseUrl(form.privateKey);
        return {
          key: index,
          name: form.name,
          formUrl: <a href={formUrl}> {formUrl}</a>,
          responseUrl: <a href={responseUrl}> {responseUrl}</a>,
          createdAt: form.createdAt || new Date(),
          privateKey: form.privateKey,
        };
      })
      .sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    console.log("Table Forms", tableForms);
    setTableForms(tableForms);
  }, []);

  const gridStyle = {
    width: "25%",
    textAlign: "center",
    margin: "10px",
  };

  return (
    <div>
      {tableForms.length !== 0 && (
        // <Table dataSource={tableForms} columns={columns} />
        <Card title="Your Saved Forms">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              justifyItems: "center",
            }}
          >
            {console.log("TABLE FORMSSS!", tableForms, tableForms.length)}
            {tableForms.map((form) => {
              return (
                <Card
                  title={form.name}
                  style={gridStyle}
                  onClick={() => {
                    setCurrentForm(form);
                    setIsModalOpen(true);
                  }}
                  hoverable={true}
                  type="inner"
                >
                  {new Date(form.createdAt).toDateString()}
                </Card>
              );
            })}
            <Modal
              title={currentForm.name}
              open={isModalOpen}
              onOk={() => {
                setIsModalOpen(false);
              }}
              onCancel={() => {
                setIsModalOpen(false);
              }}
            >
              <ul>
                <li>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Title level={3}> Form Url </Title>
                    {currentForm.formUrl}
                  </div>
                </li>
                <li>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Title level={3}> Response Url </Title>
                    {currentForm.responseUrl}
                  </div>
                </li>
              </ul>
            </Modal>
          </div>
        </Card>
      )}
      {tableForms.length === 0 && (
        <div>
          {" "}
          <Text>
            Hi there! You don't have any forms yet, click{" "}
            <Link to="forms/new">
              {" "}
              <Button>Here</Button>{" "}
            </Link>{" "}
            to create one!
          </Text>
        </div>
      )}
    </div>
  );
};

export default MyForms;
