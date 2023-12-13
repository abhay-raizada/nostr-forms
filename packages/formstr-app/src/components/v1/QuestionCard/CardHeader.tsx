import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { ReactComponent as Asterisk } from "../../../Images/asterisk.svg";

const CardHeader = () => {
  return (
    <div style={{ display: "flex", paddingBottom: 10 }}>
      <div style={{ padding: 5, paddingLeft: 0 }}>
        <ArrowUpOutlined style={{ fontSize: 12 }} />
      </div>
      <div style={{ padding: 5 }}>
        <ArrowDownOutlined style={{ fontSize: 12 }} />
      </div>
      <div style={{ padding: 5 }}>
        <Asterisk
          style={{ fontSize: 12, margin: "2.5px", height: "1em", width: "1em" }}
        />
      </div>
    </div>
  );
};

export default CardHeader;
