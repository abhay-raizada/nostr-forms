import { Card, Typography, Button, Modal } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  constructFormUrl,
  constructResponseUrl,
} from "../../utils/utility";
import { MyFormTabsList, MyFormTab } from "../../constants";
import { getPastUserForms } from "@formstr/sdk";
import { Draft } from "./Drafts";

const MyForms = () => {
  const [tableForms, setTableForms] = useState(null);
  const [formDrafts, setFormDrafts] = useState(null);
  const [nostrForms, setNostrForms] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState({});
  const [activeTab, setActiveTab] = useState(MyFormTab.drafts);
  const [savedTab, setSavedTab] = useState("local");
  const { Text, Title } = Typography;

  function handleSavedTabChange(key) {
    setSavedTab(key);
  }

  function handleTabChange(key) {
    setActiveTab(key);
  }

  useEffect(() => {
    async function fetchNostrForms() {
      if (nostrForms) {
        return;
      }
      let pubKey = await window.nostr.getPublicKey();
      let nForms = await getPastUserForms(pubKey);
      setNostrForms(nForms);
    }
    let forms = localStorage.getItem("formstr:forms");
    let drafts = localStorage.getItem("formstr:drafts");
    if (tableForms && formDrafts) {
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
    fetchNostrForms();
    if (!formDrafts && drafts.length !== 0) {
      setFormDrafts(drafts);
    }
    if (!tableForms && forms.length !== 0) setTableForms(forms);
  }, [tableForms, formDrafts, nostrForms]);

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
            <Draft drafts={formDrafts} />
          </div>
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
            <Card
              tabList={[
                { key: "local", label: "Local Forms" },
                { key: "nostr", label: "Forms on Nostr" },
              ]}
              activeTabKey={savedTab}
              onTabChange={handleSavedTabChange}
              style={{ height: "100%" }}
            >
              {savedTab === "local" &&
                (tableForms || []).map((form) => {
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

              {savedTab === "local" && !tableForms && (
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
              {savedTab === "nostr" &&
                (nostrForms || []).map((form) => {
                  let formCreds = form[1];
                  return (<Card
                    title={formCreds[0]}
                    style={gridStyle}
                    onClick={() => {
                      setCurrentForm({
                        name: formCreds[0],
                        formUrl: constructFormUrl(formCreds[0]),
                        responseUrl: constructResponseUrl(formCreds[1]),
                      });
                      setIsModalOpen(true);
                    }}
                    hoverable={true}
                    type="inner"
                  >
                    Click to view urls
                  </Card>
                  )
                })}
            </Card>
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
