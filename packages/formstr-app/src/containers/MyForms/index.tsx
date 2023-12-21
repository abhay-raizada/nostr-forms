import Sidebar from "./components/Sidebar";
import Routing from "./components/Routing";
import StyleWrapper from "./style";

function MyForms() {
  return (
    <StyleWrapper>
      <Sidebar />
      <div className="my-forms">
        <Routing />
      </div>
    </StyleWrapper>
  );
}

export default MyForms;
