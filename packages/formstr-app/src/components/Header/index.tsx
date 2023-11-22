import { Layout, Menu, Row, Col } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { ReactComponent as Logo } from "../../formstr.svg";

export const NostrHeader = () => {
  const location = useLocation();
  const { Header } = Layout;
  const getSelectedTab = () => {
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
      <Header style={{ background: "white" }}>
        <Row justify="space-between">
          <Col md={3}>
            <div style={{ paddingTop: 15 }}>
              <Logo />
            </div>
          </Col>
          <Col md={9}>
            <Menu mode="horizontal" theme="light" defaultSelectedKeys={["2"]}>
              <Menu.Item key="/global">
                <Link to="global">Global Feed</Link>
              </Menu.Item>
              <Menu.Item key="/myForms">
                <Link to="myForms">My Forms</Link>
              </Menu.Item>
              <Menu.Item key="/forms/new">
                <Link to="forms/new">Create Form</Link>
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Header>
    </>
  );
};
