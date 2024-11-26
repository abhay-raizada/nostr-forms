import { Layout, Menu, Row, Col, Typography, MenuProps, Modal, Spin } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import { HEADER_MENU, HEADER_MENU_KEYS } from "./config";
import { Button } from "antd";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import StyleWrapper from "./Header.style";
import { useState } from "react";

export const CreateFormHeader: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { Header } = Layout;
  const { Text } = Typography;
  const { saveForm, setSelectedTab, formSettings, relayList } = useFormBuilderContext();

  const onClickHandler: MenuProps["onClick"] = (e) => {
    setSelectedTab(e.key);
  };

  const handlePublishClick = async () => {
    if (!formSettings?.formId) {
      alert("Form ID is required");
      return;
    }

    setIsModalOpen(true);

    try {
      await saveForm();
    } catch (error) {
      console.error("Failed to publish the form", error);
    }
  };

  const renderRelays = () => {
    if (!relayList) return null;
    return relayList.map(({ url }) => (
      <Row key={url} align="middle" style={{ marginBottom: 8 }}>
        <Spin size="small" style={{ marginRight: 8 }} />
        <Text>{url}</Text>
      </Row>
    ));
  };

  return (
    <StyleWrapper>
      <Header className="create-form-header">
        <Row className="header-row" justify="space-between">
          <Col>
            <Row className="header-row" justify="space-between">
              <Col style={{ paddingRight: 10, paddingBottom: 4, color: "black" }}>
                <Link className="app-link" to="/">
                  <ArrowLeftOutlined />
                </Link>
              </Col>
              <Col>
                <Text>All Forms</Text>
              </Col>
            </Row>
          </Col>

          <Col md={8} xs={10} sm={10}>
            <Row className="header-row" justify="end">
              <Col>
                <Button type="primary" onClick={handlePublishClick}>
                  Publish
                </Button>
              </Col>
              <Col md={12} xs={5} sm={2}>
                <Menu
                  mode="horizontal"
                  theme="light"
                  defaultSelectedKeys={[HEADER_MENU_KEYS.BUILDER]}
                  overflowedIndicator={<MenuOutlined />}
                  items={HEADER_MENU}
                  onClick={onClickHandler}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Modal
          title="Publishing Form"
          open={isModalOpen}
          footer={null}
          closable={false}
        >
          <div>
            <Text strong style={{ display: "block", marginBottom: 16 }}>
              Relays
            </Text>
            {renderRelays()}
          </div>
        </Modal>
      </Header>
    </StyleWrapper>
  );
};
