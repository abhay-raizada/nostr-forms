import { Menu } from "antd";
import { Link, matchRoutes, useLocation } from "react-router-dom";

export const Header = (props) => {
  const location = useLocation();
  const routes = [{ path: "/forms/:npub" }, { path: "/forms/:nsec/responses" }];
  //const route = matchRoutes(location);
  console.log(location);

  const getSelectedTab = () => {
    if (location.pathname === "/forms/new") {
      return "/forms/new";
    } else if (location.pathname === "/forms/fill") {
      return "/forms/fill";
    } else if (location.pathname === "/forms/responses") {
      return "/forms/responses";
    } else {
      const route = matchRoutes(routes, location);
      if (!route) {
        return "/myForms";
      }
      if (route?.length !== 0 && route[0].route?.path === "/forms/:npub") {
        return "/forms/fill";
      } else if (
        route?.length !== 0 &&
        route[0].route?.path === "/forms/:nsec/responses"
      ) {
        console.log("heeere ");
        return "/forms/responses";
      }
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
        <Menu.Item key="/myForms">
          <Link to="myForms">My Forms</Link>
        </Menu.Item>
        <Menu.Item key="/forms/new">
          <Link to="forms/new">Create Form</Link>
        </Menu.Item>
        <Menu.Item key="/forms/responses">
          <Link to="forms/responses">View Form Responses</Link>
        </Menu.Item>
        <Menu.Item key="/forms/fill">
          <Link to="forms/fill">Fill Form</Link>
        </Menu.Item>
      </Menu>
    </>
  );
};
