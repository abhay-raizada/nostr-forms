import { V1Field } from "@formstr/sdk/dist/interfaces";
import { Card } from "antd";

interface QuestionProps {
  field: V1Field;
}

export const QuestionNode: React.FC<QuestionProps> = ({ field }) => {
  return (
    <Card
      type="inner"
      style={{
        maxWidth: "100%",
        margin: "10px",
        textAlign: "left",
      }}
    >
      <div>
        <label>{field.question}</label>
      </div>
    </Card>
  );
};
