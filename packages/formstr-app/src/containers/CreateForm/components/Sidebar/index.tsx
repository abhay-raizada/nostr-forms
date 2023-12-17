import { Layout, Divider } from "antd";
import BasicMenu from "../BasicMenu";
import InputsMenu from "../InputsMenu";
import PreBuiltMenu from "../PreBuiltMenu";
import StyledWrapper from "./style";

function Sidebar({ className }: { className: string }) {
  return (
    <StyledWrapper className={className}>
      <Layout.Sider
        className="create-sidebar"
        width={242}
        style={{
          marginTop: "1px",
        }}
      >
        <BasicMenu />
        <Divider className="menu-divider" />
        <InputsMenu />
        <Divider className="menu-divider" />
        <PreBuiltMenu />
      </Layout.Sider>
    </StyledWrapper>
  );
}

export default Sidebar;
