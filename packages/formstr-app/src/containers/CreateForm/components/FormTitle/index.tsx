import { Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import StyleWrapper from "./style";

const { Text } = Typography;

function FormTitle({ className }: { className: string }) {
  const { formSettings, updateFormSetting } = useFormBuilderContext();

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
      <Text className="title-text">
        This is the title of your form! Tap to edit.
      </Text>
    </StyleWrapper>
  );
}

export default FormTitle;
