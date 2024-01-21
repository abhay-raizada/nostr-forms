import { Layout, Menu, Row, Col } from "antd";
import { Link } from "react-router-dom";
import "./index.css";
import { ReactComponent as Logo } from "../../Images/formstr.svg";
import { MenuOutlined } from "@ant-design/icons";
import { HEADER_MENU } from "./configs";

export const NostrHeader = () => {
  const { Header } = Layout;
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
              defaultSelectedKeys={[]}
              overflowedIndicator={<MenuOutlined />}
              items={HEADER_MENU}
            />
          </Col>
        </Row>
      </Header>
    </>
  );
};
