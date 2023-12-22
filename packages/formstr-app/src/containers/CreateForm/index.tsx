import FormBuilderProvider from "./providers/FormBuilder";
import FormBuilder from "./FormBuilder";

function CreateForm() {
  return (
    <FormBuilderProvider>
      <FormBuilder />
    </FormBuilderProvider>
  );
}

export default CreateForm;
