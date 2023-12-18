import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import FormSettings from "../FormSettings";
import AnswerSettings from "../AnswerSettings";
import StyleWrapper from "./style";

function Settings() {
  const { questionIdInFocus } = useFormBuilderContext();

  return (
    <StyleWrapper>
      {questionIdInFocus ? <AnswerSettings /> : <FormSettings />}
    </StyleWrapper>
  );
}

export default Settings;
