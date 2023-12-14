import { Menu } from 'antd';
import { PRE_BUILT_MENU } from "../../configs/menuConfig";

function PreBuiltMenu() {
  const items = [{ key: "Pre-built", label: "Pre-built", children: PRE_BUILT_MENU, type: "group" }]
  return (
      <Menu items={items} />
  );
}

export default PreBuiltMenu;