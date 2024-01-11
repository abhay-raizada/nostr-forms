import { Divider, Switch, Typography } from "antd";
import StyleWrapper from "./style";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import TitleImage from "./TitleImage";
import { Notifications } from "./Notifications";

const { Text } = Typography;

function FormSettings() {
  const { formSettings, updateFormSetting } = useFormBuilderContext();

  const handleAnonymousToggle = (checked: boolean) => {
    updateFormSetting({
      disallowAnonymous: checked,
    });
  };

  const handlePublicForm = (checked: boolean) => {
    updateFormSetting({
      publicForm: checked,
    });
  };

  return (
    <StyleWrapper>
      <div className="form-setting">
        <TitleImage titleImageUrl={formSettings.titleImageUrl} />
      </div>
      <Divider className="divider" />
      <div className="form-setting">
        <Text className="property-name">Notify on response</Text>
        <Notifications />
      </div>
      <Divider className="divider" />
      <div className="form-setting">
        <div className="property-setting">
          <Text className="property-text">Public Form</Text>
          <Switch onChange={handlePublicForm} />
        </div>
      </div>
      <Divider className="divider" />
      <div className="form-setting">
        <div className="property-setting">
          <Text className="property-text">Disallow Anonymous Submissions</Text>
          <Switch onChange={handleAnonymousToggle} />
        </div>
      </div>
      <Divider className="divider" />
    </StyleWrapper>
  );
}

export default FormSettings;
