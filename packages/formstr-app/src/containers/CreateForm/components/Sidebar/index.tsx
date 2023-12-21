import { Divider } from "antd";
import BasicMenu from "../BasicMenu";
import InputsMenu from "../InputsMenu";
import PreBuiltMenu from "../PreBuiltMenu";
import Sidebar from "../../../../components/Sidebar";

function SidebarMenu() {
  return (
    <Sidebar width={242}>
      <BasicMenu />
      <Divider className="menu-divider" />
      <InputsMenu />
      <Divider className="menu-divider" />
      <PreBuiltMenu />
    </Sidebar>
  );
}

export default SidebarMenu;
