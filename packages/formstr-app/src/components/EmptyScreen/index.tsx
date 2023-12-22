import { Link } from "react-router-dom";
import { Typography, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ReactComponent as NoData } from "../../Images/noData.svg";
import StyleWrapper from "./style";

const { Text } = Typography;

function EmptyScreen() {
  return (
    <StyleWrapper>
      <NoData className="empty-screen" />
      <Text className="no-data">No data available!</Text>
      <Button
        className="add-form"
        type="primary"
        icon={<PlusOutlined style={{ paddingTop: "2px" }} />}
      >
        <Link to="/forms/new">Create Form</Link>
      </Button>
    </StyleWrapper>
  );
}

export default EmptyScreen;
