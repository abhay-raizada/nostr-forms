import { useLocation } from "react-router-dom";
import FormBuilder from "./FormBuilder";
import useFormBuilderContext from "./hooks/useFormBuilderContext";
import { useEffect, useState } from "react";

function CreateForm() {
  const { state } = useLocation();
  const { initializeForm, saveDraft } = useFormBuilderContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (state && !initialized) {
      initializeForm(state);
    }
    setInitialized(true);
    return () => {
      if (initialized) {
        saveDraft();
      }
    };
  }, [state, initialized, initializeForm, saveDraft]);

  return <FormBuilder />;
}

export default CreateForm;
