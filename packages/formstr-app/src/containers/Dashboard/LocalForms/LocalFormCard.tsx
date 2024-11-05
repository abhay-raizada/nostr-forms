import { Button, Card, Divider, Typography } from "antd";
import { ILocalForm } from "../../CreateFormNew/providers/FormBuilder/typeDefs";
import { useNavigate } from "react-router-dom";
import { DeleteFilled } from "@ant-design/icons";
import DeleteFormTrigger from "./DeleteForm";

interface LocalFormCardProps {
  form: ILocalForm;
  onDeleted: () => void;
}

const { Text } = Typography;
export const LocalFormCard: React.FC<LocalFormCardProps> = ({
  form,
  onDeleted,
}) => {
  const navigate = useNavigate();
  return (
    <Card
      title={form.name}
      className="form-card"
      extra={<DeleteFormTrigger formKey={form.key} onDeleted={onDeleted} />}
    >
      <Divider />
      <Button
        onClick={(e) => {
          navigate(`/response/${form.privateKey}`);
        }}
      >
        View Responses
      </Button>
      <Button
        onClick={(e: any) => {
          e.stopPropagation();
          navigate(`/f/${form.publicKey}/${form.formId}`);
        }}
        style={{
          marginLeft: "10px",
        }}
      >
        Open Form
      </Button>
    </Card>
  );
};
