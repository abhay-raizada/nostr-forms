import { Menu } from 'antd';
import { INPUTS_MENU } from "../../configs/menuConfig";

function InputsMenu() {
  const items = [{ key: "Inputs", label: "Inputs", children: INPUTS_MENU, type: "group" }]
  return (
      <Menu items={items} />
  );
}

export default InputsMenu;