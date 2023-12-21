import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import FormSettings from "../FormSettings";
import AnswerSettings from "../AnswerSettings";
import StyleWrapper from "./style";
import { forwardRef } from "react";

// TODO: remove usage of any here
function Settings(_props: any, ref: any) {
  const { questionIdInFocus } = useFormBuilderContext();

  return (
    <StyleWrapper ref={ref} className="right-sidebar">
      {questionIdInFocus ? <AnswerSettings /> : <FormSettings />}
    </StyleWrapper>
  );
}

export default forwardRef(Settings);
