import { Button, Card, Divider, Typography } from "antd";
import { ILocalForm } from "../CreateFormNew/providers/FormBuilder/typeDefs";
import { useNavigate } from "react-router-dom";

interface LocalFormCardProps {
  form: ILocalForm;
}

const { Text } = Typography;
export const LocalFormCard: React.FC<LocalFormCardProps> = ({ form }) => {
  const navigate = useNavigate();
  return (
    <Card
      title={form.name}
      className="form-card"
      onClick={() => {
        navigate(`/fill/${form.publicKey}`);
      }}
      hoverable={true}
    >
      <Divider />
      <Button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/response/${form.privateKey}`);
        }}
      >
        View Responses
      </Button>
    </Card>
  );
};
