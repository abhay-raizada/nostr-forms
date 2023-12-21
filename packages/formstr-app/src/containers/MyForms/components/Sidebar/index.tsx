import { Menu } from "antd";
import Sidebar from "../../../../components/Sidebar";
import { MY_FORM_MENU } from "../../configs/menuConfig";
import { DEFAULT_SELECT_KEY } from "../../configs/constants";

function SidebarMenu() {
  return (
    <Sidebar width={242}>
      <Menu defaultSelectedKeys={[DEFAULT_SELECT_KEY]} items={MY_FORM_MENU} />
    </Sidebar>
  );
}

export default SidebarMenu;
