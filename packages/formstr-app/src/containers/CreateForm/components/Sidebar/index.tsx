import { Layout, Divider } from "antd";
import BasicMenu from "../BasicMenu";
import InputsMenu from "../InputsMenu";
import PreBuiltMenu from "../PreBuiltMenu";
import StyledWrapper from "./style";
import { MutableRefObject, Ref, RefObject, forwardRef } from "react";

type SidebarPropType = {
  className: string;
};

const Sidebar = (props: SidebarPropType, ref: any) => {
  const { className } = props;
  return (
    <StyledWrapper ref={ref} className={className}>
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
