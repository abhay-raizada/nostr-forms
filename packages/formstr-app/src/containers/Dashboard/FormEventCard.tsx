import { Tag } from "@formstr/sdk/dist/formstr/nip101";
import { Card, Typography } from "antd";
import { Event } from "nostr-tools";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

interface FormEventCardProps {
  event: Event;
}

export const FormEventCard: React.FC<FormEventCardProps> = ({ event }) => {
  const navigate = useNavigate();
  const name = event.tags.find((tag: Tag) => tag[0] === "name") || [];
  const pubKey = event.pubkey;
  const formId = event.tags.find((tag: Tag) => tag[0] === "d")?.[1];

  if (!formId) {
    return <Card title="Invalid Form Event">{JSON.stringify(event)}</Card>;
  }

  let publicForm = event.content === "";
  return (
    <>
      <Card
        title={name[1] || "Hidden Form"}
        className="form-card"
        onClick={() => {
          navigate(`/f/${pubKey}/${formId}`);
        }}
        hoverable={true}
      >
        {publicForm ? (
          <Text>
            {" "}
            {event.tags.filter((tag: Tag) => tag[0] === "field").length}{" "}
            Questions
          </Text>
        ) : (
          <Text> Hidden Content</Text>
        )}
      </Card>
    </>
  );
};
