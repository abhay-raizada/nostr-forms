import { Button, Card, Divider, Typography } from "antd";
import { ILocalForm } from "../../CreateFormNew/providers/FormBuilder/typeDefs";
import { useNavigate } from "react-router-dom";
import { DeleteFilled } from "@ant-design/icons";
import DeleteFormTrigger from "./DeleteForm";
import { constructFormUrl } from "../../../utils/formUtils";
import { nip19 } from "nostr-tools";

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
  let responseUrl = form.formId
    ? `/s/${form.privateKey}/${form.formId}`
    : `/response/${form.privateKey}`;
  let formUrl =
    form.publicKey && form.formId
      ? `/f/${nip19.naddrEncode({
          pubkey: form.publicKey,
          identifier: form.formId,
          relays: [form.relay || "wss://relay.damus.io"],
          kind: 30168,
        })}`
      : `/fill/${form.publicKey}`;
  return (
    <Card
      title={form.name}
      className="form-card"
      extra={<DeleteFormTrigger formKey={form.key} onDeleted={onDeleted} />}
    >
      <Divider />
      <Button
        onClick={(e) => {
          navigate(responseUrl);
        }}
      >
        View Responses
      </Button>
      <Button
        onClick={(e: any) => {
          e.stopPropagation();
          navigate(formUrl);
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
