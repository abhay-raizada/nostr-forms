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
  console.log("local form, form", form);
  return (
    <Card
      title={form.name}
      className="form-card"
      // onClick={() => {
      //   navigate(`/fill/${form.publicKey}`);
      // }}
      hoverable={true}
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
    </Card>
  );
};
