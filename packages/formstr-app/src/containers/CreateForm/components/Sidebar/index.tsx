import { Layout, Divider } from "antd";
import BasicMenu from "../BasicMenu";
import InputsMenu from "../InputsMenu";
import PreBuiltMenu from "../PreBuiltMenu";
import StyledWrapper from "./style";
import { forwardRef } from "react";

// TODO: remove usage of any here
const Sidebar = (_props: any, ref: any) => {
  return (
    <StyledWrapper ref={ref} className="left-sidebar">
      <Layout.Sider className="create-sidebar" width={252}>
        <BasicMenu />
        <Divider className="menu-divider" />
        <InputsMenu />
        <Divider className="menu-divider" />
        <PreBuiltMenu />
      </Layout.Sider>
    </StyledWrapper>
  );
};

export default forwardRef(Sidebar);
