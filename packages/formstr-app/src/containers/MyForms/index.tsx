import Sidebar from "./components/Sidebar";
import Routing from "./components/Routing";
import useDeviceType from "../../hooks/useDeviceType";
import StyleWrapper from "./style";

function MyForms() {
  const { MOBILE } = useDeviceType();

  return (
    <StyleWrapper>
      {!MOBILE && <Sidebar />}
      <div className="my-forms">
        <Routing />
      </div>
    </StyleWrapper>
  );
}

export default MyForms;
