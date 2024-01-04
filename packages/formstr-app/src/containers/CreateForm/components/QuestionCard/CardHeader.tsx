import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import cs from "classnames";
import { ReactComponent as Asterisk } from "../../../../Images/asterisk.svg";
import StyledWrapper from "./CardHeader.style";
import useFormBuilderContext from "../../hooks/useFormBuilderContext";
import useDeviceType from "../../../../hooks/useDeviceType";
import { IQuestion } from "../../typeDefs";

interface CardHeaderProps {
  required?: boolean;
  onRequired: (required: boolean) => void;
  question: IQuestion;
  onReorderKey: (keyType: "UP" | "DOWN", tempId: string) => void;
  firstQuestion: boolean;
  lastQuestion: boolean;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  required,
  onRequired,
  onReorderKey,
  question,
  firstQuestion,
  lastQuestion,
}) => {
  const { MOBILE } = useDeviceType();
  const { toggleSettingsWindow } = useFormBuilderContext();
  return (
    <StyledWrapper>
      <div className="action-wrapper">
        <div style={{ display: "flex" }}>
          {!firstQuestion && (
            <div className="action-icon">
              <ArrowUpOutlined
                className="icon-svg"
                onClick={() => onReorderKey("UP", question?.tempId)}
              />
            </div>
          )}
          {!lastQuestion && (
            <div className="action-icon">
              <ArrowDownOutlined
                className="icon-svg"
                onClick={() => onReorderKey("DOWN", question?.tempId)}
              />
            </div>
          )}
          <div className="action-icon">
            <Asterisk
              className={cs("asterisk", { asteriskSelected: required })}
              onClick={() => {
                onRequired(!required);
              }}
            />
          </div>
        </div>

        {MOBILE && (
          <div className="action-icon">
            <MoreOutlined onClick={toggleSettingsWindow} />
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default CardHeader;
