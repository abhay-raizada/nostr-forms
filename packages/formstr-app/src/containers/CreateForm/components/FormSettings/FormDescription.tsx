import { useEffect, useState } from "react";
import { Switch, Typography } from "antd";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";

const { Text } = Typography;

function FormDescription({ description }: { description?: string }) {
  const [checked, setChecked] = useState(!!description);
  const { updateFormSetting } = useFormBuilderContext();

  const onToggle = (checked: boolean) => {
    if (!checked) {
      updateFormSetting({
        description: undefined,
      });
    }
    setChecked(checked);
  };

  useEffect(() => {
    setChecked(!!description);
  }, [description]);

  return (
    <>
      <div className="property-setting">
        <Text className="property-name">Description</Text>
        <Switch checked={checked} onChange={onToggle} />
      </div>
      {checked && (
        <input
          className="file-input"
          type="text"
          value={description}
          onChange={(e) => updateFormSetting({ description: e.target.value })}
        />
      )}
    </>
  );
}

export default FormDescription;
