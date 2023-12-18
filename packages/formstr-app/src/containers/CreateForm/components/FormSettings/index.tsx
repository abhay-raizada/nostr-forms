import { Button, Divider, Switch, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import StyleWrapper from "./style";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import TitleImage from "./TitleImage";

const { Text } = Typography;

function FormSettings() {
  const { formSettings, updateFormSetting } = useFormBuilderContext();

  return (
    <StyleWrapper>
      <div className="form-setting">
        <TitleImage titleImageUrl={formSettings.titleImageUrl} />
        <div className="property-setting">
          <Text className="property-name">Description</Text>
          <Switch
            checked={formSettings.description}
            onChange={(checked) => updateFormSetting({ description: checked })}
          />
        </div>
      </div>
      <Divider className="divider" />
      <div className="form-setting">
        <div className="property-setting">
          <Text className="property-name">Thank you page</Text>
          <Switch
            checked={formSettings.thankYouPage}
            onChange={(checked) => updateFormSetting({ thankYouPage: checked })}
          />
        </div>
      </div>
      <Divider className="divider" />
      <Button className="delete-button" type="text" danger>
        <DeleteOutlined /> Delete
      </Button>
    </StyleWrapper>
  );
}

export default FormSettings;
