import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Typography } from "antd";
const { Text } = Typography;

export const DraftsController = () => {
  const { encodedForm } = useParams();
  let draft = window.decodeURIComponent(encodedForm);
  draft = JSON.parse(window.atob(draft));

  const navigate = useNavigate();
  useEffect(() => {
    if (draft !== undefined && draft !== null) {
      navigate("/forms/new", {
        state: { formSpec: draft.formSpec, tempId: draft.tempId },
      });
    }
  }, [draft, navigate]);

  return <Text> Taking you to your draft</Text>;
};
