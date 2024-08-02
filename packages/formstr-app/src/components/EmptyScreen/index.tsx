import { Link } from "react-router-dom";
import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ReactComponent as NoData } from "../../Images/no-forms.svg";
import StyleWrapper from "./style";
import { ROUTES } from "../../constants/routes";

const { Text } = Typography;

interface EmptyScreenProps {
  message?: string;
  linkTo?: string;
  linkLabel?: string;
}

function EmptyScreen({ message, linkTo, linkLabel }: EmptyScreenProps) {
  return (
    <StyleWrapper>
      <NoData className="empty-screen" />
      <Text className="no-data">
        {message || "Get started by creating your first form!"}
      </Text>
      <Button
        className="add-form"
        type="primary"
        icon={linkTo ? null : <PlusOutlined style={{ paddingTop: "2px" }} />}
      >
        <Link to={linkTo || ROUTES.CREATE_FORMS_NEW}>
          {linkLabel || "Create Form"}
        </Link>
      </Button>
    </StyleWrapper>
  );
}

export default EmptyScreen;
