import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { ReactComponent as Asterisk } from "../../../../Images/asterisk.svg";
import StyledWrapper from "./CardHeader.style";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import { IQuestion } from "../../typeDefs";

interface CardHeaderProps {
  required?: boolean;
  onRequired: (required: boolean) => void;
  question: IQuestion;
  onReorderKey: (keyType: "UP" | "DOWN", tempId: string) => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  required,
  onRequired,
  onReorderKey,
  question,
}) => {
  const { toggleSettingsWindow } = useFormBuilderContext();
  return (
    <StyledWrapper>
      <div className="action-wrapper">
        <div style={{ display: "flex" }}>
          <div className="action-icon">
            <ArrowUpOutlined
              style={{ fontSize: 12 }}
              onClick={() => onReorderKey("UP", question?.tempId)}
            />
          </div>
          <div className="action-icon">
            <ArrowDownOutlined
              style={{ fontSize: 12 }}
              onClick={() => onReorderKey("DOWN", question?.tempId)}
            />
          </div>
          <div className="action-icon">
            <Asterisk
              style={{
                fontSize: 12,
                margin: "2.5px",
                height: "1em",
                width: "1em",
              }}
              className={!required ? "asterisk" : "asteriskSelected"}
              onClick={() => {
                onRequired(!required);
              }}
            />
          </div>
        </div>

        <div className="action-icon">
          <MoreOutlined onClick={toggleSettingsWindow} />
        </div>
      </div>
    </StyledWrapper>
  );
};

export default CardHeader;
