import { useState } from "react";
import { Switch, Typography } from "antd";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";

const { Text } = Typography;

function TitleImage({ titleImageUrl }: { titleImageUrl?: string }) {
  const [checked, setChecked] = useState(!!titleImageUrl);
  const { updateFormSetting, updateFormTitleImage } = useFormBuilderContext();

  const onToggle = (checked: boolean) => {
    if (!checked) {
      updateFormSetting({
        titleImageUrl: undefined,
      });
    }
    setChecked(checked);
  };

  return (
    <>
      <div className="property-setting">
        <Text className="property-name">Title image</Text>
        <Switch checked={checked} onChange={onToggle} />
      </div>
      {checked && (
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={updateFormTitleImage}
        />
      )}
    </>
  );
}

export default TitleImage;
