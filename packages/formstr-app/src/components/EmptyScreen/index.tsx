import { Link } from "react-router-dom";
import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ReactComponent as NoData } from "../../Images/noData.svg";
import StyleWrapper from "./style";
import { ROUTES } from "../../constants/routes";

const { Text } = Typography;

function EmptyScreen() {
  return (
    <StyleWrapper>
      <NoData className="empty-screen" />
      <Text className="no-data">You don't have any forms yet!</Text>
      <Button
        className="add-form"
        type="primary"
        icon={<PlusOutlined style={{ paddingTop: "2px" }} />}
      >
        <Link to={ROUTES.CREATE_FORMS}>Create Form</Link>
      </Button>
    </StyleWrapper>
  );
}

export default EmptyScreen;
