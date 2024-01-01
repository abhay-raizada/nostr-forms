import { Layout, Menu, Row, Col, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeftOutlined, MenuOutlined } from "@ant-design/icons";
import { ROUTES } from "../../../../constants/routes";
import { useHeaderConfig, HEADER_MENU_KEYS } from "./config";

export const CreateFormHeader = () => {
  const location = useLocation();
  const { Header } = Layout;
  const { Text } = Typography;

  const { HEADER_MENU } = useHeaderConfig();

  const getSelectedTab = () => {
    if (location.pathname === ROUTES.RESPONSES) {
      return HEADER_MENU_KEYS.RESPONSES;
    }
    if (location.pathname === ROUTES.PREVIEW) {
      return HEADER_MENU_KEYS.PREVIEW;
    }
    return "";
  };

  return (
    <>
      <Header
        className="header-style"
        style={{
          background: "white",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Row className="header-row" justify="space-between">
          <Col>
            <Row className="header-row" justify="space-between">
              <Col
                style={{ paddingRight: 10, paddingBottom: 4, color: "black" }}
              >
                <Link className="app-link" to="/myForms">
                  <ArrowLeftOutlined />
                </Link>
              </Col>
              <Col>
                <Text>All Forms</Text>
              </Col>
            </Row>
          </Col>
          <Col md={6} xs={2} sm={2}>
            <Menu
              mode="horizontal"
              theme="light"
              defaultSelectedKeys={[getSelectedTab()]}
              overflowedIndicator={<MenuOutlined />}
              items={HEADER_MENU}
            />
          </Col>
        </Row>
      </Header>
    </>
  );
};
