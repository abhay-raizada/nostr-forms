import { Layout, Menu, Row, Col, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { ReactComponent as Logo } from "../../Images/formstr.svg";
import {
  MenuOutlined,
  PlusOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

export const NostrHeader = () => {
  const location = useLocation();
  const { Header } = Layout;
  const getSelectedTab = () => {
    if (location.pathname === "/myForms") {
      return "/myForms";
    }
    if (location.pathname === "/forms/new") {
      return "/forms/new";
    }
    if (location.pathname === "/global") {
      return "/global";
    }
    return "/myForms";
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
          <Col md={2} xs={1} sm={1}>
            <div>
              <Link className="app-link" to="/myForms">
                <Logo />
              </Link>
            </div>
          </Col>
          <Col md={8} xs={2} sm={2}>
            <Menu
              mode="horizontal"
              theme="light"
              defaultSelectedKeys={[getSelectedTab()]}
              overflowedIndicator={<MenuOutlined />}
            >
              <Menu.Item key="/global" icon={<SearchOutlined />}>
                <Link to="global">Public Forms</Link>
              </Menu.Item>
              <Menu.Item key="/myForms" icon={<UserOutlined />}>
                <Link to="myForms">My Forms</Link>
              </Menu.Item>
              <Menu.Item key="/forms/new">
                <Button
                  type="primary"
                  icon={<PlusOutlined style={{ paddingTop: "2px" }} />}
                >
                  <Link to="forms/new">Create Form</Link>
                </Button>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
    </>
  );
};
