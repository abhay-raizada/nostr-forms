import { Card } from "antd";
import { Event } from "nostr-tools";

interface FormEventCardProps {
  event: Event;
}

export const FormEventCard: React.FC<FormEventCardProps> = ({ event }) => {
  return (
    <>
      <Card title="Dummy Card">Dummy things</Card>
    </>
  );
};
