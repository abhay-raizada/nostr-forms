import { Divider, Switch, Tooltip, Typography } from "antd";
import StyleWrapper from "./style";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import TitleImage from "./TitleImage";
import { Sharing } from "./Sharing";
import { RelayList } from "./RelayList";
import FormIdentifier from "./FormIdentifier";

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
        <Text className="property-name">Form Identifier</Text>
        <FormIdentifier />
      </div>
      <div className="form-setting">
        <TitleImage titleImageUrl={formSettings.titleImageUrl} />
      </div>
      <Divider className="divider" />
      <div className="form-setting">
        <Text className="property-name">Form Access Settings</Text>
        <Sharing />
      </div>

      <Divider className="divider" />
      <div className="form-setting">
        <Tooltip title="This will make the form appear on the Public Forms section on formstr">
          <div className="property-setting">
            <Text className="property-text">Show in public feed</Text>
            <Switch onChange={handlePublicForm} />
          </div>
        </Tooltip>
      </div>
      <Divider className="divider" />
      <div className="form-setting">
        <div className="property-setting">
          <Text className="property-text">Disallow Anonymous Submissions</Text>
          <Switch
            defaultChecked={formSettings.disallowAnonymous}
            onChange={handleAnonymousToggle}
          />
        </div>
        {formSettings.disallowAnonymous && (
          <Text className="warning-text">
            *This will require participants to have a nostr profile with a
            <a
              href="https://nostrcheck.me/register/browser-extension.php"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              nip-07 extension
            </a>
          </Text>
        )}
      </div>
      <Divider className="divider" />
      <div className="form-setting">
        <RelayList />
      </div>
    </StyleWrapper>
  );
}

export default FormSettings;
