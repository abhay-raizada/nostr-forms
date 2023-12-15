import { Menu } from 'antd';
import { BASIC_MENU } from "../../configs/menuConfig";

function BasicMenu() {
  const items = [{ key: "Basic", label: "Basic", children: BASIC_MENU, type: "group" }]
  return (
      <Menu items={items} />
  );
}

export default BasicMenu;