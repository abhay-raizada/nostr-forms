import { useNavigate, useParams } from "react-router";
import { Typography } from "antd";
import { IDraft } from "../MyForms/components/Drafts/typeDefs";
import { ROUTES } from "../../constants/routes";
import useFormBuilderContext from "../CreateFormNew/hooks/useFormBuilderContext";
import { useEffect } from "react";
const { Text } = Typography;

export const V1DraftsController = () => {
  const { encodedForm } = useParams();
  const { initializeForm } = useFormBuilderContext();
  const navigate = useNavigate();

  let draft: string | null = null;
  let parsedDraft: IDraft | null = null;
  if (encodedForm) {
    draft = window.decodeURIComponent(encodedForm);
    parsedDraft = JSON.parse(decodeURIComponent(window.atob(draft)));
  }
  useEffect(() => {
    if (!parsedDraft) return;
    initializeForm(parsedDraft);
    navigate(ROUTES.CREATE_FORMS, {
      state: parsedDraft,
    });
  }, [encodedForm, initializeForm, navigate, parsedDraft]);
  if (!parsedDraft) return <Text>Invalid draft</Text>;
  return <Text> Taking you to your draft...</Text>;
};
