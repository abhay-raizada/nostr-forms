import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { Typography } from "antd";
const {Text} = Typography;

export const DraftsController = () => {
  const { encodedForm } = useParams();
  const draft = JSON.parse(window.atob(encodedForm));
  const navigate = useNavigate();
  useEffect(() => {
    console.log("draaaaaaft paaarsed", draft)
    if(draft !== undefined && draft !== null)
    {
        navigate("/forms/new", {
        state: { formSpec: draft.formSpec, tempId: draft.tempId },
        });
    }
  }, [draft, navigate]);

  return <Text> Taking you to your draft</ Text>
};
