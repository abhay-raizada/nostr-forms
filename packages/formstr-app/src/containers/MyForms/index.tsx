import Sidebar from "./components/Sidebar";
import Routing from "./components/Routing";
import useDeviceType from "../../hooks/useDeviceType";
import StyleWrapper from "./style";
import { Typography } from "antd";
const { Text } = Typography;

function MyForms() {
  const { MOBILE } = useDeviceType();

  return (
    <StyleWrapper>
      {!MOBILE && <Sidebar />}
      <div className="my-forms-container">
        <div className="my-forms">
          <Routing />
        </div>
        <div className="text-container">
          <Text className="text-style"> Formstr is free and open source</Text>
        </div>
      </div>
    </StyleWrapper>
  );
}

export default MyForms;
