import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { ReactComponent as Asterisk } from "../../../../Images/asterisk.svg";
import StyledWrapper from "./style";

interface CardHeaderProps {
  required?: boolean;
  onRequired: (required: boolean) => void;
}

const CardHeader: React.FC<CardHeaderProps> = ({ required, onRequired }) => {
  return (
    <StyledWrapper>
      <div style={{ display: "flex", paddingBottom: 10 }}>
        <div style={{ padding: 5, cursor: "pointer", paddingLeft: 0 }}>
          <ArrowUpOutlined style={{ fontSize: 12 }} />
        </div>
        <div style={{ padding: 5, cursor: "pointer" }}>
          <ArrowDownOutlined style={{ fontSize: 12 }} />
        </div>
        <div style={{ padding: 5, cursor: "pointer" }}>
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
    </StyledWrapper>
  );
};

export default CardHeader;
