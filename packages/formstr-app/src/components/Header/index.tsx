import { Layout, Menu, Row, Col } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { ReactComponent as Logo } from "../../Images/formstr.svg";
import { MenuOutlined } from "@ant-design/icons";
import { HEADER_MENU, HEADER_MENU_KEYS } from "./configs";
import { ROUTES } from "../../constants/routes";

export const NostrHeader = () => {
  const location = useLocation();
  const { Header } = Layout;
  const getSelectedTab = () => {
    if (location.pathname.includes(ROUTES.MY_FORMS)) {
      return HEADER_MENU_KEYS.MY_FORMS;
    }
    if (location.pathname === "/forms/new") {
      return HEADER_MENU_KEYS.CREATE_FORMS;
    }
    if (location.pathname === "/global") {
      return HEADER_MENU_KEYS.PUBLIC_FORMS;
    }
    return HEADER_MENU_KEYS.MY_FORMS;
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
            <Link className="app-link" to="/myForms">
              <Logo />
            </Link>
          </Col>
          <Col md={8} xs={2} sm={2}>
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
