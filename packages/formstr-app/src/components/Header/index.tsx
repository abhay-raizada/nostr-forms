import {
  Layout,
  Menu,
  Row,
  Col,
  Button,
  Dropdown,
  MenuProps,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import "./index.css";
import { ReactComponent as Logo } from "../../Images/formstr.svg";
import { DownOutlined, MenuOutlined, UserOutlined } from "@ant-design/icons";
import { HEADER_MENU, HEADER_MENU_KEYS } from "./configs";
import { useProfileContext } from "../../hooks/useProfileContext";
import { NostrAvatar } from "./NostrAvatar";

export const NostrHeader = () => {
  const { Header } = Layout;
  const { pubkey, requestPubkey, logout } = useProfileContext();

  const dropdownMenuItems: MenuProps["items"] = [
    {
      key: "1",
      label: <a onClick={logout}>Logout</a>,
    },
  ];

  const myForms = {
    key: HEADER_MENU_KEYS.MY_FORMS,
    icon: pubkey ? (
      <div>
        <Dropdown
          menu={{
            items: dropdownMenuItems,
            overflowedIndicator: null,
            style: { overflow: "auto" },
          }}
          trigger={["click"]}
        >
          <div onClick={(e) => e.preventDefault()}>
            <NostrAvatar pubkey={pubkey} /> <DownOutlined />
          </div>
        </Dropdown>
      </div>
    ) : (
      <Button
        type="text"
        size="small"
        onClick={() => requestPubkey()}
        style={{ color: "black" }}
        icon={<UserOutlined />}
      >
        <Typography.Text style={{ marginTop: 3 }}>Login</Typography.Text>
      </Button>
    ),
  };
  const newHeaderMenu = [...HEADER_MENU, myForms];
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
            <Link className="app-link" to="/">
              <Logo />
            </Link>
          </Col>
          <Col md={8} xs={2} sm={2}>
            <Menu
              mode="horizontal"
              theme="light"
              defaultSelectedKeys={[]}
              overflowedIndicator={<MenuOutlined />}
              items={newHeaderMenu}
            />
          </Col>
        </Row>
      </Header>
    </>
  );
};
