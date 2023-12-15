import { Layout, Divider } from 'antd';
import BasicMenu from "../BasicMenu";
import InputsMenu from "../InputsMenu";
import PreBuiltMenu from "../PreBuiltMenu";
import "./index.css";

function Sidebar() {
  return (
    <Layout.Sider
      className="create-sidebar"
      width={252} 
      style={{ 
        height: "calc(100vh - 112px)",
        marginTop: "1px"
      }}
    >
      <BasicMenu />
      <Divider className="menu-divider" />
      <InputsMenu />
      <Divider className="menu-divider" />
      <PreBuiltMenu />
    </Layout.Sider>
  );
}

export default Sidebar;