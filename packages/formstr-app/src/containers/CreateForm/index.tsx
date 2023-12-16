import Sidebar from "./components/Sidebar";
import { QuestionsList } from "./components/QuestionsList";
import FormBuilderProvider from "./providers/FormBuilder";

function FormBuilder() {
  return (
    <FormBuilderProvider>
      <div style={{ display: "flex", maxWidth: "100vw" }}>
        <Sidebar />
        <QuestionsList />
        <div style={{ minWidth: "20%" }}>right sidebar</div>
      </div>
    </FormBuilderProvider>
  );
}

export default FormBuilder;
