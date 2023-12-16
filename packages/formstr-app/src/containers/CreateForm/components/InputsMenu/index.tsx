import { useContext } from "react";
import { Menu } from "antd";
import { INPUTS_MENU } from "../../configs/menuConfig";
import { FormBuilderContext } from "../../providers/FormBuilder";

function InputsMenu() {
  const { addQuestion } = useContext(FormBuilderContext);

  const onMenuClick = ({ key }: { key: string }) => {
    const selectedItem = INPUTS_MENU.find((item) => item.key === key);
    addQuestion(selectedItem?.type);
  };

  const items = [
    { key: "Inputs", label: "Inputs", children: INPUTS_MENU, type: "group" },
  ];
  return <Menu selectedKeys={[]} items={items} onClick={onMenuClick} />;
}

export default InputsMenu;
