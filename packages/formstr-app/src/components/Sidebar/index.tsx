import { Layout } from "antd";
import StyledWrapper from "./style";

function Sidebar({
  className,
  width,
  children,
}: {
  className?: string;
  width: number;
  children: React.ReactNode;
}) {
  return (
    <StyledWrapper className={className}>
      <Layout.Sider
        className="create-sidebar"
        width={width}
        style={{
          marginTop: "1px",
        }}
      >
        {children}
      </Layout.Sider>
    </StyledWrapper>
  );
}

export default Sidebar;
