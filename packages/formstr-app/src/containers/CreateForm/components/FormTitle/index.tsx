import { Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import StyleWrapper from "./style";
import { useRef } from "react";
import { useEditable } from "use-editable";

const { Text } = Typography;

function FormTitle({ className }: { className: string }) {
  const { formSettings, updateFormSetting, formName, updateFormName } =
    useFormBuilderContext();
  const formTitleRef = useRef(null);

  const handleTitleChange = (text: string) => {
    updateFormName(text);
  };

  useEditable(formTitleRef, handleTitleChange);

  return (
    <StyleWrapper
      className={className}
      titleImageUrl={formSettings.titleImageUrl}
    >
      <div className="image-utils">
        <div
          className="icon-util"
          onClick={() => updateFormSetting({ titleImageUrl: "" })}
        >
          <DeleteOutlined />
        </div>
      </div>
      <Text className="title-text" ref={formTitleRef}>
        {formName}
      </Text>
    </StyleWrapper>
  );
}

export default FormTitle;
