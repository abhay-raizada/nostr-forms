import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

export const Header = (props) => {
  const location = useLocation();
  //const route = matchRoutes(location);

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
      <Menu
        mode="horizontal"
        style={{ display: "flex", justifyContent: "center" }}
        selectedKeys={[getSelectedTab()]}
      >
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
    </>
  );
};
