import { Layout, Menu, Row, Col, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import "./index.css";
import { ReactComponent as Logo } from "../../formstr.svg";

export const NostrHeader = () => {
  const location = useLocation();
  const { Header } = Layout;
  const getSelectedTab = () => {
    console.log("locaaation", location.pathname);
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
      <Header style={{ background: "white" }}>
        <Row justify="space-between">
          <Col md={3}>
            <div style={{ paddingTop: 15 }}>
              <Link to="/myForms">
                <Logo />
              </Link>
            </div>
          </Col>
          <Col md={9}>
            <Menu
              mode="horizontal"
              theme="light"
              defaultSelectedKeys={[getSelectedTab()]}
            >
              <Menu.Item key="/global">
                <Link to="global">Global Feed</Link>
              </Menu.Item>
              <Menu.Item key="/myForms">
                <Link to="myForms">My Forms</Link>
              </Menu.Item>
              <Menu.Item key="/forms/new">
                <Button
                  type="primary"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgb(255, 81, 47) 0%, rgb(238, 132, 80) 99%, rgb(255, 42, 0) 100%)",
                    transition: "0.5s",
                    backgroundSize: "200% auto",
                    color: "white",
                    boxShadow: "0 0 20px #eee",
                    borderRadius: "5px",
                  }}
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
