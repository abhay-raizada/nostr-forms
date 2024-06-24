import { Typography } from "antd";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import { ChangeEvent, useState } from "react";

const { Text } = Typography;

function FormIdentifier() {
  const { updateFormSetting, formSettings } = useFormBuilderContext();
  const [formId, setFormId] = useState<string>(formSettings.formId || "");

  const handleIdentifierChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormId(e.target.value);
    updateFormSetting({ ...formSettings, formId: e.target.value });
  };
  return (
    <>
      <input
        className="file-input"
        type="text"
        placeholder="FormId: Ex - Registration Form"
        value={formId}
        onChange={handleIdentifierChange}
      />
    </>
  );
}

export default FormIdentifier;
