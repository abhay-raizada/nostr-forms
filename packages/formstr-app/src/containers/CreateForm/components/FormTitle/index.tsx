import { Typography } from "antd";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import StyleWrapper from "./style";
import { useRef } from "react";
import { useEditable } from "use-editable";

const { Text } = Typography;

function FormTitle({
  className,
  edit = true,
  imageUrl,
  formTitle,
}: {
  className: string;
  edit?: boolean;
  imageUrl?: string;
  formTitle?: string;
}) {
  const {
    formSettings,
    updateFormSetting,
    formName,
    updateFormName,
    toggleSettingsWindow,
  } = useFormBuilderContext();

  const settings = {
    name: edit ? formName : formTitle,
    image: edit ? formSettings.titleImageUrl : imageUrl,
  };
  const formTitleRef = useRef(null);

  const handleTitleChange = (text: string) => {
    updateFormName(text);
  };

  useEditable(formTitleRef, handleTitleChange);

  console.log("image being used is ", settings.image);

  return (
    <StyleWrapper className={className} titleImageUrl={settings.image}>
      <div className="image-utils">
        {edit && (
          <>
            <div
              className="icon-util"
              title="Delete cover"
              onClick={() => updateFormSetting({ titleImageUrl: "" })}
            >
              <DeleteOutlined />
            </div>
            <div
              className="icon-util"
              title="Form settings"
              onClick={toggleSettingsWindow}
            >
              <MoreOutlined />
            </div>
          </>
        )}
      </div>
      <Text className="title-text" ref={edit ? formTitleRef : null}>
        {settings.name}
      </Text>
    </StyleWrapper>
  );
}

export default FormTitle;
