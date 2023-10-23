import { Card, Typography, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { constructFormUrl, constructResponseUrl } from "../../utils/utility";
import { MyFormTabsList, MyFormTab } from "../../constants";

const MyForms = () => {
  const [tableForms, setTableForms] = useState([]);
  const [formDrafts, setFormDrafts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState({});
  const [activeTab, setActiveTab] = useState(MyFormTab.drafts);
  const { Text, Title } = Typography;

  function handleTabChange(key) {
    setActiveTab(key);
  }

  useEffect(() => {
    let forms = localStorage.getItem("formstr:forms");
    let drafts = localStorage.getItem("formstr:drafts");
    if (tableForms.length !== 0 || formDrafts.length !== 0) {
      return;
    }
    if (forms) {
      forms = JSON.parse(forms);
    }
    if (drafts) {
      drafts = JSON.parse(drafts);
    }
    drafts = drafts || [];
    forms = forms || [];
    forms = forms
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
    setFormDrafts(drafts);
    setTableForms(forms);
  }, [tableForms, formDrafts]);

  const gridStyle = {
    textAlign: "center",
    margin: "10px",
  };

  return (
    <div>
      <Card
        tabList={MyFormTabsList}
        activeTabKey={activeTab}
        onTabChange={handleTabChange}
      >
        {activeTab === MyFormTab.drafts && (
          <>
            {formDrafts.map((draft) => {
              console.log("Draft", draft, draft["name"]);
              return (
                <Card
                  title={draft.formSpec.name}
                  style={gridStyle}
                  type="inner"
                  hoverable={true}
                >
                  {JSON.stringify(draft)}
                </Card>
              );
            })}
            {formDrafts.length === 0 && (
              <div>
                {" "}
                <Text>
                  Hi there! You don't have any drafts yet, click{" "}
                  <Link to="/forms/new">
                    {" "}
                    <Button>Here</Button>{" "}
                  </Link>{" "}
                  to create one!
                </Text>
              </div>
            )}
          </>
        )}
        {activeTab === MyFormTab.savedForms && (
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
            {tableForms.length === 0 && (
              <div>
                {" "}
                <Text>
                  Hi there! You don't have any forms yet, click{" "}
                  <Link to="/forms/new">
                    {" "}
                    <Button>Here</Button>{" "}
                  </Link>{" "}
                  to create one!
                </Text>
              </div>
            )}
          </div>
        )}
      </Card>
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
  );
};

export default MyForms;
