import { Button } from "antd";
import { MY_FORM_MENU } from "../../../MyForms/configs/menuConfig";
import { isMobile } from "../../../../utils/utility";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";

export const HEADER_MENU_KEYS = {
  RESPONSES: "RESPONSES",
  PREVIEW: "PREVIEW",
  PUBLISH: "PUBLISH",
};

export const useHeaderConfig = () => {
  const { saveForm } = useFormBuilderContext();

  const HEADER_MENU = [
    {
      key: HEADER_MENU_KEYS.RESPONSES,
      label: "Responses",
    },
    {
      key: HEADER_MENU_KEYS.PREVIEW,
      label: "Preview",
      ...(isMobile() && { children: MY_FORM_MENU }),
    },
    {
      key: HEADER_MENU_KEYS.PUBLISH,
      label: (
        <Button type="primary" onClick={saveForm}>
          Publish
        </Button>
      ),
    },
  ];
  return { HEADER_MENU };
};
