import { useLocation } from "react-router-dom";
import { Menu } from "antd";
import Sidebar from "../../../../../components/Sidebar";
import { MY_FORM_MENU } from "../../configs/menuConfig";
import { getSelectedKey } from "../../utils";

function SidebarMenu() {
  const location = useLocation();

  return (
    <Sidebar width={242}>
      <Menu
        defaultSelectedKeys={[getSelectedKey(location)]}
        items={MY_FORM_MENU}
      />
    </Sidebar>
  );
}

export default SidebarMenu;
