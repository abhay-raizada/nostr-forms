import Sidebar from "./components/Sidebar";
import { QuestionsList } from "./components/QuestionsList";
import FormBuilderProvider from "./providers/FormBuilder";
import Settings from "./components/Settings";

function FormBuilder() {
  return (
    <FormBuilderProvider>
      <div style={{ display: "flex", maxWidth: "100vw" }}>
        <Sidebar />
        <QuestionsList />
        <Settings />
      </div>
    </FormBuilderProvider>
  );
}

export default FormBuilder;
