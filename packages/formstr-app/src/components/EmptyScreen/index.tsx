import { Link, useNavigate } from "react-router-dom";
import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ReactComponent as NoData } from "../../Images/no-forms.svg";
import StyleWrapper from "./style";
import { ROUTES } from "../../constants/routes";
import { act } from "react-dom/test-utils";

const { Text } = Typography;

interface EmptyScreenProps {
  message?: string;
  action?: () => void;
  actionLabel?: string;
}

function EmptyScreen({ message, action, actionLabel }: EmptyScreenProps) {
  let navigate = useNavigate();
  console.log("message,", message, action, actionLabel);
  return (
    <StyleWrapper>
      <NoData className="empty-screen" />
      <Text className="no-data">
        {message || "Get started by creating your first form!"}
      </Text>
      <Button
        className="add-form"
        type="primary"
        icon={action ? null : <PlusOutlined style={{ paddingTop: "2px" }} />}
        onClick={() => {
          if (action) action();
          else {
            navigate(ROUTES.CREATE_FORMS_NEW);
          }
        }}
      >
        {actionLabel || "Create Form"}
      </Button>
    </StyleWrapper>
  );
}

export default EmptyScreen;
